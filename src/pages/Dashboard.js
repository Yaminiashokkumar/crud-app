import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import TestConnection from '../components/TestConnection';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Grid,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function Dashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '' });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user?.email);
      if (!user) {
        navigate('/');
      } else {
        fetchItems();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchItems = async () => {
    try {
      console.log('Fetching items for user:', auth.currentUser?.uid);
      const itemsRef = collection(db, 'items');
      const q = query(
        itemsRef,
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      console.log('Query snapshot size:', querySnapshot.size);
      const itemsList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Document data:', data);
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate()
        };
      });
      console.log('Final items list:', itemsList);
      setItems(itemsList);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddItem = async () => {
    try {
      console.log('Adding new item:', newItem);
      const itemsRef = collection(db, 'items');
      const docRef = await addDoc(itemsRef, {
        ...newItem,
        userId: auth.currentUser.uid,
        createdAt: new Date()
      });
      console.log('Item added with ID:', docRef.id);
      setNewItem({ title: '', description: '' });
      setOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleUpdateItem = async () => {
    try {
      const itemRef = doc(db, 'items', editingItem.id);
      await updateDoc(itemRef, {
        title: editingItem.title,
        description: editingItem.description
      });
      setEditOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'items', id));
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No date';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <TestConnection />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Items</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add New Item
        </Button>
      </Box>

      <List>
        {items.map((item) => (
          <Paper key={item.id} sx={{ mb: 2, p: 2 }}>
            <ListItem
              secondaryAction={
                <Box>
                  <IconButton edge="end" onClick={() => {
                    setEditingItem(item);
                    setEditOpen(true);
                  }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDeleteItem(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={item.title}
                secondary={
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {item.description}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        Created: {formatDate(item.createdAt)}
                      </Typography>
                    </Grid>
                  </Grid>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>

      {/* Add Item Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddItem} variant="contained" color="primary">
            Add Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={editingItem?.title || ''}
            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={editingItem?.description || ''}
            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateItem} variant="contained" color="primary">
            Update Item
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" color="error" onClick={() => signOut(auth)}>
          Logout
        </Button>
      </Box>
    </Container>
  );
} 