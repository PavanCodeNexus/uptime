package com.uptime.common.utils;

import com.uptime.common.constants.ErrorCodes;
import com.uptime.common.exceptions.ValidationException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

public final class FileUtils {
    private FileUtils() {}

    /**
     * Inspects the file header magic bytes to prevent MIME-type spoofing or executable uploads.
     * Supports JPEG, PNG, PDF, MP4, WAV, and MP3.
     */
    public static void verifyMagicBytes(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ValidationException(ErrorCodes.MAGIC_BYTES_MISMATCH, "Uploaded file is empty");
        }
        byte[] header = new byte[12];
        try (InputStream is = file.getInputStream()) {
            int read = is.read(header);
            if (read < 4) {
                throw new ValidationException(ErrorCodes.MAGIC_BYTES_MISMATCH, "File too small to verify signature");
            }
            if (!isAllowedMagicSignature(header, read)) {
                throw new ValidationException(
                        ErrorCodes.MAGIC_BYTES_MISMATCH,
                        "File signature (magic bytes) does not match an allowed media or document format");
            }
        } catch (IOException e) {
            throw new ValidationException(ErrorCodes.MAGIC_BYTES_MISMATCH, "Failed to read file header for verification");
        }
    }

    public static boolean isAllowedMagicSignature(byte[] h, int len) {
        if (h == null || len < 4) {
            return false;
        }
        // JPEG: FF D8 FF
        if ((h[0] & 0xFF) == 0xFF && (h[1] & 0xFF) == 0xD8 && (h[2] & 0xFF) == 0xFF) {
            return true;
        }
        // PNG: 89 50 4E 47
        if ((h[0] & 0xFF) == 0x89 && h[1] == 0x50 && h[2] == 0x4E && h[3] == 0x47) {
            return true;
        }
        // PDF: 25 50 44 46 (%PDF)
        if (h[0] == 0x25 && h[1] == 0x50 && h[2] == 0x44 && h[3] == 0x46) {
            return true;
        }
        // WAV: 52 49 46 46 (RIFF)
        if (h[0] == 0x52 && h[1] == 0x49 && h[2] == 0x46 && h[3] == 0x46) {
            return true;
        }
        // MP3: ID3 (49 44 33) or MPEG frame sync (FF FB / FF F3 / FF F2)
        if ((h[0] == 0x49 && h[1] == 0x44 && h[2] == 0x33)
                || ((h[0] & 0xFF) == 0xFF && ((h[1] & 0xE0) == 0xE0))) {
            return true;
        }
        // MP4: ....ftyp (bytes 4..7 == 'f','t','y','p')
        if (len >= 8 && h[4] == 'f' && h[5] == 't' && h[6] == 'y' && h[7] == 'p') {
            return true;
        }
        return false;
    }
}
