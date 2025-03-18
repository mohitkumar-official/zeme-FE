import React from 'react';
import { HelpCircle } from 'lucide-react';
import { REQUIRED_DOCUMENTS, OPTIONAL_DOCUMENTS } from './constants';

// Define types for the props
interface DocumentSelectionProps {
  formData: {
    upload_document: {
      required_documents: string[];
      optional_documents: string[];
    } | [];
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function DocumentSelection({ formData, setFormData }: DocumentSelectionProps) {
  // Initialize upload_document if it's an empty array
  const uploadDocument = Array.isArray(formData.upload_document) 
    ? { required_documents: [], optional_documents: [] }
    : formData.upload_document;

  // Function to toggle the document selection
  const toggleDocument = (documentId: string, isRequired: boolean) => {
    setFormData((prev: DocumentSelectionProps['formData']) => {
      const prevUploadDoc = Array.isArray(prev.upload_document)
        ? { required_documents: [], optional_documents: [] }
        : prev.upload_document;

      const documentSet = isRequired ? 'required_documents' : 'optional_documents';
      const newDocuments = prevUploadDoc[documentSet].includes(documentId)
        ? prevUploadDoc[documentSet].filter((id: string) => id !== documentId)
        : [...prevUploadDoc[documentSet], documentId];

      return {
        ...prev,
        upload_document: {
          ...prevUploadDoc,
          [documentSet]: newDocuments,
        },
      };
    });
  };

  // Handle select all documents
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allRequiredIds = REQUIRED_DOCUMENTS.map((doc) => doc.id);
    setFormData((prev: DocumentSelectionProps['formData']) => {
      const prevUploadDoc = Array.isArray(prev.upload_document)
        ? { required_documents: [], optional_documents: [] }
        : prev.upload_document;

      return {
        ...prev,
        upload_document: {
          ...prevUploadDoc,
          required_documents: e.target.checked ? allRequiredIds : [],
        },
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Select the documents you would like your buyer to upload
        </h2>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            onChange={handleSelectAll}
            className="rounded text-blue-500"
          />
          <span className="text-gray-700">Select All</span>
        </label>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <h3 className="font-medium text-gray-800">Zeme Required List</h3>
            <HelpCircle className="h-4 w-4 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REQUIRED_DOCUMENTS.map((doc) => {
              const isSelected = uploadDocument.required_documents.includes(doc.id);
              return (
                <button
                  key={doc.id}
                  onClick={() => toggleDocument(doc.id, true)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-100 shadow-md'
                      : 'border-gray-300 bg-white hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{doc.icon}</span>
                    <span className={`font-medium transition-colors duration-300 ${isSelected ? 'text-blue-600' : 'text-gray-800'}`}>
                      {doc.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-4 h-4 rounded-full bg-white" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-800">Other Documents</h3>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </div>
            <button className="text-blue-500 hover:text-blue-600">Add Document</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OPTIONAL_DOCUMENTS.map((doc) => {
              const isSelected = uploadDocument.optional_documents.includes(doc.id);
              return (
                <button
                  key={doc.id}
                  onClick={() => toggleDocument(doc.id, false)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-100 shadow-md'
                      : 'border-gray-300 bg-white hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{doc.icon}</span>
                    <span className={`font-medium transition-colors duration-300 ${isSelected ? 'text-blue-600' : 'text-gray-800'}`}>
                      {doc.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-4 h-4 rounded-full bg-white" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
