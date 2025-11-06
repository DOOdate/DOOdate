import React, { useState, useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
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
const SAVED_CLASSES_KEY = 'doodate_saved_classes_v1';

const DEFAULT_CLASSES = [
    { id: 'default-1', name: 'Math', classColor: '#4CAF50' },
    { id: 'default-2', name: 'English', classColor: '#2196F3' },
    { id: 'default-3', name: 'History', classColor: '#FFC107' },
];

function AddClass(){
        const [className, setClassName] = useState('');
        const [classColor, setClassColor] = useState('#FFA500'); // orange
        const [assignments, setAssignments] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [form, setForm] = useState({ title: '', due: '', weight: '', classId: '' });
    const [creatingInlineClass, setCreatingInlineClass] = useState(false);
    const [inlineClass, setInlineClass] = useState({ name: '', classColor: '#FFA500' });

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
                // ignore parse errors
                console.error('load addclass state', e);
            }
        }, []);

            // save on changes
            useEffect(() => {
                const payload = { className, classColor, assignments };
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch (e) { console.error('save addclass', e); }
            }, [className, classColor, assignments]);

            // saved templates
            const [savedClasses, setSavedClasses] = useState([]);
            useEffect(() => {
                try {
                    const raw = localStorage.getItem(SAVED_CLASSES_KEY);
                    if (raw) {
                        setSavedClasses(JSON.parse(raw));
                    } else {
                        setSavedClasses(DEFAULT_CLASSES);
                    }
                } catch (e) { console.error('load saved classes', e); }
            }, []);

            useEffect(() => {
                try { localStorage.setItem(SAVED_CLASSES_KEY, JSON.stringify(savedClasses)); } catch (e) {}
            }, [savedClasses]);

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

            // keyboard shortcut save (Ctrl/Cmd+S) and undo (Ctrl/Cmd+Z)
            useEffect(() => {
                function onKey(e) {
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                        e.preventDefault();
                                saveClassTemplate();
                    }
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                        e.preventDefault();
                        undo();
                    }
                }
                window.addEventListener('keydown', onKey);
                return () => window.removeEventListener('keydown', onKey);
            }, [className, classColor, assignments]);

        function openNew(){
            setEditingIndex(null);
            // default class selection: current class if set, otherwise first saved
            const defaultClassId = className ? 'current' : (savedClasses[0]?.id || '');
            setForm({ title: '', due: '', weight: '', classId: defaultClassId });
            setCreatingInlineClass(false);
            setInlineClass({ name: '', classColor: '#FFA500' });
            setOpen(true);
        }

    function openEdit(i){
        setEditingIndex(i);
        const a = assignments[i];
        setForm({ title: a.title, due: a.due, weight: a.weight, classId: a.classId || (a.classId==='current' ? 'current' : '') });
        setCreatingInlineClass(false);
        setInlineClass({ name: '', classColor: '#FFA500' });
        setOpen(true);
    }

        function save(){
            // simple validation
            if (!form.title?.trim()) return;
            pushUndo();
            if (editingIndex == null){
                // resolve class info
                let classInfo = null;
                if (form.classId === 'current') {
                    classInfo = { id: 'current', name: className || 'Untitled', classColor };
                } else if (form.classId === 'create-inline') {
                    // create inline class
                    const id = 'inline-' + Date.now();
                    const tpl = { id, name: inlineClass.name || 'New Class', classColor: inlineClass.classColor };
                    setSavedClasses(prev => [...prev, tpl]);
                    classInfo = tpl;
                } else {
                    classInfo = savedClasses.find(s => s.id === form.classId) || { id: form.classId, name: 'Unknown', classColor: '#999' };
                }
                setAssignments(prev => [...prev, { title: form.title.trim(), due: form.due, weight: form.weight, classId: classInfo.id, className: classInfo.name, classColor: classInfo.classColor }]);
            } else {
                setAssignments(prev => prev.map((it, idx) => idx === editingIndex ? { ...it, title: form.title.trim(), due: form.due, weight: form.weight, classId: form.classId, className: (savedClasses.find(s=>s.id===form.classId)||{}).name || (form.classId==='current'?className:it.className), classColor: (savedClasses.find(s=>s.id===form.classId)||{}).classColor || (form.classId==='current'?classColor:it.classColor) } : it));
            }
            setOpen(false);
        }

    function remove(i){
        pushUndo();
        setAssignments(prev => prev.filter((_, idx) => idx !== i));
    }

    // file input for import
    const fileInputRef = useRef(null);

    function saveClassTemplate(){
        const name = window.prompt('Save class as (template name):', className || 'My Class');
        if (!name) return;
        const tpl = { id: Date.now(), name, classColor, assignments };
        setSavedClasses(prev => [...prev, tpl]);
    }

    function loadSavedClass(idx){
        const tpl = savedClasses[idx];
        if (!tpl) return;
        pushUndo();
        setClassName(tpl.name || tpl.className || '');
        setClassColor(tpl.classColor || tpl.classColor || '#FFA500');
        setAssignments(tpl.assignments || []);
    }

    function deleteSavedClass(idx){
        setSavedClasses(prev => prev.filter((_,i) => i !== idx));
    }

    function exportTemplates(){
        const data = JSON.stringify(savedClasses, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'doodate-classes.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function importTemplates(file){
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (Array.isArray(parsed)){
                    setSavedClasses(prev => [...prev, ...parsed]);
                }
            } catch (err) { console.error('import templates', err); }
        };
        reader.readAsText(file);
    }

        return (
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', p: { xs: 2, md: 4 } }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Setup new Class</Typography>

                        <Stack spacing={2} sx={{ mb: 2 }}>
                            <TextField label="Class name" value={className} onChange={e => setClassName(e.target.value)} fullWidth />

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField label="Class colour" value={classColor} onChange={e => setClassColor(e.target.value)} sx={{ width: 160 }} />
                                {/* native color picker hidden but usable: */}
                                <input type="color" aria-label="choose color" value={classColor} onChange={e => setClassColor(e.target.value)} style={{ width: 36, height: 36, border: 'none', padding: 0 }} />
                                <Chip label="Preview" sx={{ bgcolor: classColor, color: (parseInt(classColor.replace('#',''),16) > 0xffffff/2) ? 'black' : 'white' }} />
                            </Box>

                            <Box>
                                <Stack direction="row" spacing={1}>
                                    <Button variant="outlined" onClick={() => { pushUndo(); setClassName(''); setClassColor('#FFA500'); setAssignments([]); localStorage.removeItem(STORAGE_KEY); }}>
                                        Reset
                                    </Button>
                                    <Button variant="contained" onClick={() => saveClassTemplate()}>Save class</Button>
                                    <Button variant="text" onClick={() => undo()}>Undo</Button>
                                </Stack>
                            </Box>
                        </Stack>

                        <Divider sx={{ my: 1 }} />

                        <Typography variant="subtitle1" sx={{ mb: 1 }}>Live preview</Typography>
                        <Card variant="outlined" sx={{ p:2 }}>
                            <Typography variant="subtitle2">{className || 'Class name'}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Chip label=" " sx={{ bgcolor: classColor, width: 28, height: 28 }} />
                                <Typography variant="caption" color="text.secondary">{assignments.length} assignments</Typography>
                                <Box sx={{ flex: 1 }} />
                                <Typography variant="caption" sx={{ mr:1 }}>Total weight</Typography>
                                <Chip label={`${assignments.reduce((s,a)=>s+Number(a.weight||0),0)}%`} color={assignments.reduce((s,a)=>s+Number(a.weight||0),0) > 100 ? 'error' : 'default'} />
                            </Box>
                            {assignments.reduce((s,a)=>s+Number(a.weight||0),0) > 100 && (
                                <Typography variant="caption" color="error" sx={{ mt:1 }}>Warning: total weight exceeds 100%</Typography>
                            )}
                        </Card>

                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" sx={{ mt: 1 }}>Templates</Typography>
                        <Box sx={{ mt: 1 }}>
                            {savedClasses.length === 0 && (
                                <Typography variant="caption" color="text.secondary">No saved classes. Save a class to reuse it.</Typography>
                            )}
                            {savedClasses.map((s, idx) => (
                                <Box key={s.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <Chip label={s.name} onClick={() => loadSavedClass(idx)} sx={{ cursor: 'pointer' }} />
                                    <Button size="small" onClick={() => loadSavedClass(idx)}>Load</Button>
                                    <Button size="small" onClick={() => deleteSavedClass(idx)}>Delete</Button>
                                </Box>
                            ))}

                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={e => importTemplates(e.target.files?.[0])} />
                                <Button size="small" onClick={() => exportTemplates()}>Export</Button>
                                <Button size="small" onClick={() => fileInputRef.current && fileInputRef.current.click()}>Import</Button>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1">Dead lines and due dates</Typography>
                            <Button startIcon={<AddIcon />} variant="contained" onClick={openNew}>Add</Button>
                        </Box>

                        <Card variant="outlined" sx={{ minHeight: 280, p: 1 }}>
                            <List>
                                {assignments.length === 0 && (
                                    <ListItem>
                                        <Typography variant="body2" color="text.secondary">No assignments yet. Tap Add to create one.</Typography>
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

                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>{editingIndex == null ? 'Add assignment' : 'Edit assignment'}</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 1, minWidth: { xs: 280, sm: 360 } }}>
                            <TextField label="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} fullWidth autoFocus />

                            <FormControl fullWidth>
                                <InputLabel id="class-select-label">Class</InputLabel>
                                <Select
                                    labelId="class-select-label"
                                    value={form.classId || ''}
                                    label="Class"
                                    onChange={e => {
                                        const v = e.target.value;
                                        setForm(f => ({ ...f, classId: v }));
                                        if (v === 'create-inline') setCreatingInlineClass(true);
                                        else setCreatingInlineClass(false);
                                    }}
                                >
                                    {className && <MenuItem value={'current'}>Use current: {className}</MenuItem>}
                                    {savedClasses.map(s => <MenuItem value={s.id} key={s.id}>{s.name}</MenuItem>)}
                                    <MenuItem value={'create-inline'}>Create new class...</MenuItem>
                                </Select>
                            </FormControl>

                            {creatingInlineClass && (
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <TextField label="New class name" value={inlineClass.name} onChange={e => setInlineClass(prev => ({ ...prev, name: e.target.value }))} fullWidth />
                                    <input type="color" value={inlineClass.classColor} onChange={e => setInlineClass(prev => ({ ...prev, classColor: e.target.value }))} style={{ width: 36, height: 36, border: 'none', padding: 0 }} />
                                </Box>
                            )}

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
        )
}

export default AddClass;