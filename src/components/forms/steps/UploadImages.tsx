import React from 'react';

interface ImageUploadProps {
  formData: {
    images: Array<{ image_url: string }>;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, string>;
}

export function ImageUpload({ formData, setFormData, errors }: ImageUploadProps) {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(formData, 'form data is here');
    const files = Array.from(e.target.files || []);
  
    if (files.length === 0) return; // Ensure at least one file is selected
  
    // Create a FormData object to hold files
    const formDataToSend = new FormData();

    files.forEach(file => {
      formDataToSend.append("file", file);
    });

    try {
      const response = await fetch("http://localhost:8000/api/property/upload", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();
      console.log('response is here', result);

      if (response.ok) {
        setFormData((prev:ImageUploadProps['formData']) => {
          const newImages = files.map(file => ({
            image_url: result.filePath, // Use the returned filePath from the API response
          }));

          return {
            ...prev,
            images: prev.images[0]?.image_url === '' ? newImages : [...prev.images, ...newImages],
          };
        });
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Upload Images</h2>

      <div className="border-2 border-dashed border-pink-200 rounded-lg p-8 bg-pink-50">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Drag and drop or click to upload</p>
          <p className="text-sm text-gray-600">
            Please select a minimum of 5 and a maximum of 25 images from your device to proceed.
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="mt-4 inline-block px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600"
          >
            Select Files
          </label>
        </div>
      </div>

      {formData.images.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Selected files ({formData.images.length}/25):
          </p>
          <div className="grid grid-cols-4 gap-4">
            {formData.images.map((file, index) => (
              file.image_url && ( // Check if image_url exists and is valid
                <div key={index} className="relative">
                  <img
                    src={`http://localhost:8000${file.image_url}`}
                    alt={`Upload preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setFormData((prev:ImageUploadProps['formData']) => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
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

      {formData.images.length < 5 && (
        <p className="text-sm text-red-500">
          Please select at least five files to proceed.
        </p>
      )}
    </div>
  );
}
