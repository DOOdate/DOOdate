import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function EventCard({ title, className, date, weight, colour }) {
    const { t } = useTranslation();
    const accent = colour || '#000000';
    return (
        <Box sx={{ 
            borderRadius: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            p: 1.5,
            m: 1.5, 
            bgcolor: 'background.paper', 
            boxShadow: 2,
            borderLeft: `5px solid ${accent}` }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ textAlign: 'left', lineHeight: 1.15, fontSize: '1rem' }}>{title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', lineHeight: 1.1 }}>{date}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mt: 0.75 }}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left', lineHeight: 1.1 }}>{className}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', lineHeight: 1.1 }}>{t('Weight')} {weight}</Typography>
            </Box>
        </Box>
    )
}

EventCard.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    date: PropTypes.string,
    weight: PropTypes.string,
    colour: PropTypes.string
}

EventCard.defaultProps = {
    title: 'Untitled',
    className: 'Unknown',
    date: 'TBD',
    weight: 'N/A',
    colour: '#000000'
}

export default EventCard;