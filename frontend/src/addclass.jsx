import React, { useState, useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';
import Divider from '@mui/material/Divider';

function formatDate(d) {
    if (!d) return '';
    try { return new Date(d).toLocaleString(); } catch { return d; }
}

const STORAGE_KEY = 'doodate_addclass_v1';

function AddClass(){
    const [className, setClassName] = useState('');
    const [classColor, setClassColor] = useState('#FFA500'); // orange
    const [assignments, setAssignments] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [form, setForm] = useState({ title: '', due: '', weight: '' });

    // load saved state on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.className) setClassName(parsed.className);
                if (parsed.classColor) setClassColor(parsed.classColor);
                if (Array.isArray(parsed.assignments)) setAssignments(parsed.assignments);
            }
        } catch (e) {
            console.error('load addclass state', e);
        }
    }, []);

    // save on changes
    useEffect(() => {
        const payload = { className, classColor, assignments };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch (e) { console.error('save addclass', e); }
    }, [className, classColor, assignments]);

    // undo stack
    const undoStack = useRef([]);
    function pushUndo() {
        undoStack.current.push({ className, classColor, assignments: JSON.parse(JSON.stringify(assignments)) });
        if (undoStack.current.length > 20) undoStack.current.shift();
    }
    function undo() {
        const last = undoStack.current.pop();
        if (!last) return;
        setClassName(last.className || '');
        setClassColor(last.classColor || '#FFA500');
        setAssignments(last.assignments || []);
    }

    function openNew() {
        setEditingIndex(null);
        setForm({ title: '', due: '', weight: '' });
        setOpen(true);
    }

    function openEdit(i) {
        setEditingIndex(i);
        const a = assignments[i];
        setForm({ title: a.title, due: a.due, weight: a.weight });
        setOpen(true);
    }

    function save() {
        if (!form.title?.trim()) return;
        pushUndo();
        
        const assignmentData = { 
            title: form.title.trim(), 
            due: form.due, 
            weight: form.weight,
            className: className || 'Untitled',
            classColor
        };

        if (editingIndex == null) {
            setAssignments(prev => [...prev, assignmentData]);
        } else {
            setAssignments(prev => prev.map((it, idx) => 
                idx === editingIndex ? assignmentData : it
            ));
        }
        setOpen(false);
    }

    function remove(i) {
        pushUndo();
        setAssignments(prev => prev.filter((_, idx) => idx !== i));
    }

    // keyboard shortcuts for undo (Ctrl/Cmd+Z)
    useEffect(() => {
        function onKey(e) {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                undo();
            }
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [className, classColor, assignments]);

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: 'background.default', 
            color: 'text.primary',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: { xs: 2, md: 4 }
        }}>
            <Box sx={{ 
                width: '100%',
                maxWidth: { xs: '100%', sm: '600px', md: '800px', lg: '1000px' },
                mx: 'auto'
            }}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={10} md={5}>
                        <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>Setup new Class</Typography>

                        <Stack spacing={2} sx={{ mb: 2 }}>
                            <TextField label="Class name" value={className} onChange={e => setClassName(e.target.value)} fullWidth />

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                                <TextField label="Class colour" value={classColor} onChange={e => setClassColor(e.target.value)} sx={{ width: 160 }} />
                                <input type="color" aria-label="choose color" value={classColor} onChange={e => setClassColor(e.target.value)} style={{ width: 36, height: 36, border: 'none', padding: 0 }} />
                                <Chip label="Preview" sx={{ bgcolor: classColor, color: (parseInt(classColor.replace('#',''),16) > 0xffffff/2) ? 'black' : 'white' }} />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Stack direction="row" spacing={1}>
                                    <Button variant="outlined" onClick={() => { pushUndo(); setClassName(''); setClassColor('#FFA500'); setAssignments([]); localStorage.removeItem(STORAGE_KEY); }}>
                                        Reset
                                    </Button>
                                    <Button variant="text" onClick={() => undo()}>Undo</Button>
                                </Stack>
                            </Box>
                        </Stack>

                        <Divider sx={{ my: 1 }} />

                        <Typography variant="subtitle1" sx={{ mb: 1, textAlign: 'center' }}>Live preview</Typography>
                        <Card variant="outlined" sx={{ p:2 }}>
                            <Typography variant="subtitle2" align="center">{className || 'Class name'}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Chip label=" " sx={{ bgcolor: classColor, width: 28, height: 28 }} />
                                <Typography variant="caption" color="text.secondary">{assignments.length} assignments</Typography>
                                <Box sx={{ flex: 1 }} />
                                <Typography variant="caption" sx={{ mr:1 }}>Total weight</Typography>
                                <Chip label={`${assignments.reduce((s,a)=>s+Number(a.weight||0),0)}%`} color={assignments.reduce((s,a)=>s+Number(a.weight||0),0) > 100 ? 'error' : 'default'} />
                            </Box>
                            {assignments.reduce((s,a)=>s+Number(a.weight||0),0) > 100 && (
                                <Typography variant="caption" color="error" sx={{ mt:1, display: 'block', textAlign: 'center' }}>Warning: total weight exceeds 100%</Typography>
                            )}
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={10} md={7}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1">Deadlines and due dates</Typography>
                            <Button startIcon={<AddIcon />} variant="contained" onClick={openNew}>Add</Button>
                        </Box>

                        <Card variant="outlined" sx={{ minHeight: 280, p: 1 }}>
                            <List>
                                {assignments.length === 0 && (
                                    <ListItem>
                                        <Typography variant="body2" color="text.secondary" sx={{ width: '100%', textAlign: 'center' }}>
                                            No assignments yet. Tap Add to create one.
                                        </Typography>
                                    </ListItem>
                                )}
                                {assignments.map((a, i) => (
                                    <Grow in key={i} timeout={200 + i * 60}>
                                        <ListItem sx={{ mb: 1 }}>
                                            <Card sx={{ width: '100%', p: 1 }}>
                                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p:1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Chip label={a.className || 'Class'} sx={{ bgcolor: a.classColor || '#999', color: (parseInt((a.classColor||'#999').replace('#',''),16) > 0xffffff/2) ? 'black' : 'white' }} size="small" />
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="subtitle2">{a.title}</Typography>
                                                            <Typography variant="caption" color="text.secondary">Due: {formatDate(a.due)}</Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Weight: {a.weight || '—'}</Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box>
                                                        <IconButton aria-label="edit" onClick={() => openEdit(i)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton aria-label="delete" onClick={() => remove(i)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </ListItem>
                                    </Grow>
                                ))}
                            </List>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editingIndex == null ? 'Add assignment' : 'Edit assignment'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: { xs: 280, sm: 360 } }}>
                        <TextField label="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} fullWidth autoFocus />
                        <TextField label="Due" type="datetime-local" value={form.due} onChange={e => setForm({...form, due: e.target.value})} InputLabelProps={{ shrink: true }} />
                        <TextField label="Weight (%)" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={save} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AddClass;