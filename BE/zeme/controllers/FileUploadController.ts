import multer, { Multer, StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import { Request, Response } from "express";

class FileUploadController {
    private storage: StorageEngine;
    private fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => void;
    public upload: Multer;

    constructor() {
        // Configure Multer storage
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "uploads/"); // Save files in "uploads" folder
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // Unique file name
            }
        });

        // File filter to allow only specific file types
        this.fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
            const allowedTypes = /jpeg|jpg|png|pdf/;
            const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = allowedTypes.test(file.mimetype);

            if (extname && mimetype) {
                cb(null, true);
            } else {
                cb(new Error("Only JPEG, PNG, and PDF files are allowed!"));
            }
        };

        // Configure multer middleware
        this.upload = multer({
            storage: this.storage,
            limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
            fileFilter: this.fileFilter
        });
    }

    public uploadFile(req: Request, res: Response): Response {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            return res.status(200).json({
                message: "File uploaded successfully!",
                fileName: req.file.filename,
                filePath: `/uploads/${req.file.filename}`,
            });
        } catch (error) {
            return res.status(500).json({ error: "File upload failed" });
        }
    }
}

export default new FileUploadController();
