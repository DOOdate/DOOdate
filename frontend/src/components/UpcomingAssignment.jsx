import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

function UpcomingAssignmentCard({ a }) {
  return (
    <Accordion sx={{ width: { xs: '85vw', md: '30vw' }, my: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon /> } onClick={a.onOpen} sx={{ cursor: 'pointer' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Typography variant="subtitle1">{a.title}</Typography>
            <Typography variant="body2" color="text.secondary">{a.course} • Due {a.due}</Typography>
          </Box>
          <Chip label={a.status} color={a.status === 'Due' ? 'error' : 'default'} />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" sx={{ mb: 1 }}>{a.summary}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="outlined" onClick={a.onOpen}>Open</Button>
          <Button size="small" variant="contained" onClick={a.onMarkDone}>Mark done</Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default function UpcomingList({ items }) {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(null)

  const demo = items ?? [
    { id: 1, title: 'Assignment 1: Arrays', course: 'CSC101', due: '2025-12-01 23:59', status: 'Due', summary: 'Implement functions for array manipulation and submit via Git.' },
    { id: 2, title: 'Lab: React Intro', course: 'WEB200', due: '2025-11-29 17:00', status: 'Soon', summary: 'Create a small React app demonstrating props and state.' },
  ]

  function handleOpen(a) {
    setCurrent(a)
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    setCurrent(null)
  }

  function handleMarkDone(a) {
    // placeholder: in future call API to mark done
    alert(`Marked "${a.title}" done (not yet implemented)`)
  }

  return (
    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Upcoming assignments</Typography>
      {demo.map(a => (
        <UpcomingAssignmentCard key={a.id} a={{ ...a, onOpen: () => handleOpen(a), onMarkDone: () => handleMarkDone(a) }} />
      ))}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {current?.title}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" color="text.secondary">{current?.course} • Due {current?.due}</Typography>
          <Typography sx={{ mt: 2 }}>{current?.summary}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button variant="contained" onClick={() => { handleMarkDone(current); handleClose(); }}>Mark done</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
