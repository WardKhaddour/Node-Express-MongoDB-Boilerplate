const fs = require('fs');

exports.createFile = () => {};

exports.deleteFile = filePath => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, err => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve();
        } else {
          reject(err);
        }
      } else {
        fs.unlink(filePath, error => {
          if (error) reject(error);
          resolve();
        });
      }
    });
  });
};

exports.getFileExtension = mimetype => {
  if (mimetype.includes('pdf')) {
    return 'pdf';
  }
  if (
    mimetype.includes(
      'vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
  )
    return 'docx';
  if (mimetype.includes('vnd.ms-powerpoint')) return 'ppt';
  if (
    mimetype.includes(
      'vnd.openxmlformats-officedocument.presentationml.presentation'
    )
  )
    return 'pptx';
  if (mimetype.includes('msword')) return '.doc';

  return 'unknown';
};
