import React from 'react'; // Import React to use JSX and functional components

// Define the TypeScript interface for the component's props
interface ImageUploadProps {
  formData: {
    images: Array<{ image_url: string }>; // Array of image objects, each containing an `image_url` string
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>; // Function to update the `formData` state
  errors: Record<string, string>; // Object containing potential validation errors
}

// ImageUpload component for handling image uploads
export function ImageUpload({ formData, setFormData, errors }: ImageUploadProps) {
  
  // Function to handle image file selection and upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    
    // Convert the selected files to an array
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return; // Exit if no files are selected

    // Create a FormData object to send files in a multipart request
    const formDataToSend = new FormData();

    // Append each selected file to FormData
    files.forEach(file => {
      formDataToSend.append("file", file);
    });

    try {
      // Send an API request to upload the images
      const response = await fetch("http://localhost:8000/api/property/upload", {
        method: "POST",
        body: formDataToSend, // Send the selected files in the request body
      });

      const result = await response.json(); // Parse the JSON response

      if (response.ok) {
        // If the upload is successful, update formData with the uploaded image URLs
        setFormData((prev: ImageUploadProps['formData']) => {
          const newImages = files.map(file => ({
            image_url: result.filePath, // Use the filePath returned by the API
          }));

          return {
            ...prev,
            // If the first image URL is empty, replace it; otherwise, append new images
            images: prev.images[0]?.image_url === '' ? newImages : [...prev.images, ...newImages],
          };
        });
      } else {
        // Log any error returned by the server
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error uploading files:", error); // Catch and log any network or server errors
    }
  };

  return (
    <div className="space-y-6">
      {/* Title of the image upload section */}
      <h2 className="text-xl font-semibold">Upload Images</h2>

      {/* Upload box with a dashed border */}
      <div className="border-2 border-dashed border-pink-200 rounded-lg p-8 bg-pink-50">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Click to upload</p>
          <p className="text-sm text-gray-600">
            Please select a minimum of 5 and a maximum of 25 images from your device to proceed.
          </p>

          {/* Hidden file input field */}
          <input
            type="file"
            multiple // Allow multiple file selection
            accept="image/*" // Restrict file selection to images only
            onChange={handleImageUpload} // Handle file selection
            className="hidden" // Hide the default file input
            id="image-upload"
          />

          {/* Custom file upload button */}
          <label
            htmlFor="image-upload"
            className="mt-4 inline-block px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600"
          >
            Select Files
          </label>
        </div>
      </div>

      {/* Display uploaded image previews */}
      {formData.images.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Selected files ({formData.images.length}/25):
          </p>
          
          {/* Grid layout for image previews */}
          <div className="grid grid-cols-4 gap-4">
            {formData.images.map((file, index) => (
              file.image_url && ( // Check if image_url exists before rendering
                <div key={index} className="relative">
                  {/* Display the uploaded image */}
                  <img
                    src={`http://localhost:8000${file.image_url}`} // Load the image from the API response URL
                    alt={`Upload preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />

                  {/* Remove image button */}
                  <button
                    onClick={() => {
                      // Remove the selected image from formData
                      setFormData((prev: ImageUploadProps['formData']) => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index) // Remove image at index
                      }));
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Display validation message if less than 5 images are uploaded */}
      {formData.images.length < 5 && (
        <p className="text-sm text-red-500">
          Please select at least five files to proceed.
        </p>
      )}
    </div>
  );
}
