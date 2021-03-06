import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

import styles from './styles.module.css';

const PhotoUpload = ({ header, content, onClick }) => {
  return (
    <div className={styles.photoUploadWrapper}>
      <div className={styles.header}>
        {header}
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.photoWrapper}>
          {content}
        </div>
        <Button className={styles.uploadButton} onClick={onClick}>Upload photo
        </Button>
      </div>
    </div>
  );
};

PhotoUpload.propTypes = {
  header: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default PhotoUpload;
