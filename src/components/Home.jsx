import React, { useEffect, useState } from 'react';
import { Box, Modal, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Doc from './Doc';
import ReactQuill from 'react-quill';
import { db, deleteDocument } from '../firebase'; // Import Firestore
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import 'react-quill/dist/quill.snow.css';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

function Home() {
  const [open, setOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [description, setDescription] = useState('');
  const [documents, setDocuments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docCollection = collection(db, 'documents');
        const snapshot = await getDocs(docCollection);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };
    fetchDocuments();
  }, []);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (docName.trim() === '') {
      alert('Document name cannot be empty!');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'documents'), {
        name: docName.trim(),
        description,
      });
      setDocuments([...documents, { id: docRef.id, name: docName.trim(), description }]);
      setDocName('');
      setDescription('');
      handleClose();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleEdit = (index) => {
    setEditing(index);
    setDocName(documents[index].name);
    setDescription(documents[index].description);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    const docRef = doc(db, 'documents', documents[editing].id);
    await updateDoc(docRef, {
      name: docName,
      description,
    });
    const updatedDocs = [...documents];
    updatedDocs[editing] = { id: documents[editing].id, name: docName, description };
    setDocuments(updatedDocs);
    setEditing(null);
    setEditModalOpen(false);
  };

  const handleDelete = async (docId) => {
    try {
      const docToDelete = documents.find(doc => doc.id === docId);

      if (docToDelete) {
        console.log(`Deleting document: ${docToDelete.name}`);
      }

      await deleteDocument(docId);

      setDocuments(documents.filter(doc => doc.id !== docId));

      alert(`Document "${docToDelete.name}" deleted successfully.`);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };



  return (
    <>
      <div className='container'>
        <h1 className='title'>Docs App</h1>
        <Button variant="contained" className='btn' onClick={handleOpen}>+ ADD  DOCUMENT</Button>
      </div>

      <div className='gridsContainer'>
        <Grid container spacing={2}>
          {documents.map((doc, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Doc
                name={doc.name}
                description={doc.description}
                onEdit={() => handleEdit(index)}
                onDelete={() => handleDelete(doc.id)}
              />
            </Grid>
          ))}
        </Grid>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h2>Add New Document</h2>
          <TextField
            fullWidth
            label="Document Name"
            variant="outlined"
            margin="normal"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
          />
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
            onClick={handleSave}>Save</Button>
        </Box>
      </Modal>

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box sx={style}>
          <h2>Edit Document</h2>
          <TextField
            fullWidth
            label="Document Name"
            variant="outlined"
            margin="normal"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
          />
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
          />
          <Button variant="contained" color="primary" onClick={handleSaveEdit} style={{ marginTop: '20px' }}>Save Changes</Button>
        </Box>
      </Modal>
    </>
  );
}

export default Home;
