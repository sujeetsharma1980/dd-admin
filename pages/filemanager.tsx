import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';

// Set up the AWS SDK with your credentials
AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region: 'us-west-2',
});

const bucket = 'dealdetector';

// Create an S3 instance
const s3 = new AWS.S3();

const ImageComponent = () => {
    const [images, setImages] = useState([]);
    const [newImage, setNewImage] = useState(null);

    useEffect(() => {
        // Fetch a list of images from your S3 bucket during component mount.
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const params = { Bucket: bucket, Prefix: "images" };
            s3.listObjects(params, (err, data) => {
                if (err) {
                    console.error('Error fetching images:', err);
                } else {
                    const validImageExtensions = [".jpeg", ".jpg", ".png", ".gif"];
                    // Filter objects with image extensions
                    const filteredObjects = data.Contents.filter((object) => {
                    return validImageExtensions.some((extension) => object.Key.endsWith(extension));
                    });
                    setImages(filteredObjects);
                }
            });
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const addImage = async () => {
        try {
            if (newImage) {
                const params = {
                    Bucket: bucket,
                    Key: `images/${newImage.name}`,
                    Body: newImage,
                    ACL: 'public-read',
                };
                s3.upload(params, (err) => {
                    if (err) {
                        console.error('Error adding image:', err);
                    } else {
                        setNewImage(null);
                        fetchImages();
                    }
                });
            }
        } catch (error) {
            console.error('Error adding image:', error);
        }
    };

    const deleteImage = async (imageKey) => {
        try {
            const params = { Bucket: bucket, Key: imageKey };
            s3.deleteObject(params, (err) => {
                if (err) {
                    console.error('Error deleting image:', err);
                } else {
                    fetchImages();
                }
            });
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const updateImage = async (imageKey) => {
        if (newImage) {
            try {
                const params = {
                    Bucket: bucket,
                    Key: imageKey, // Key of the image to be updated
                    Body: newImage,
                    ACL: 'public-read',
                };
                s3.upload(params, (err) => {
                    if (err) {
                        console.error('Error updating image:', err);
                    } else {
                        setNewImage(null);
                        fetchImages();
                    }
                });
            } catch (error) {
                console.error('Error updating image:', error);
            }
        }
    };


    return (
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4 gap-4 lg:gap-8">
                <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} />
                <span>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={addImage}>Add Image</button>
                </span>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 lg:gap-8">
                {images.map((image) => (
                    <div className="p-4 rounded-md flex items-center justify-center bg-white" key={image.Key}>
                        <div>
                        <img className="max-h-48" src={`https://${bucket}.s3.amazonaws.com/${image.Key}`} alt={image.Key} />
                        <p>{image.Key}</p>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => deleteImage(image.Key)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageComponent;
