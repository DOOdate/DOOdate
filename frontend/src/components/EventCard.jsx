import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function EventCard({ title, className, date, weight, colour, late_policy }) {
    const { t } = useTranslation();
    const accent = colour || '#000000';
    // late_policy may be an array of policy objects or a single object/string.
    // Render a readable summary instead of trying to render raw objects.
    let latePolicyNode = null;
    if (Array.isArray(late_policy)) {
        if (late_policy.length === 0) {
            latePolicyNode = t('None');
        } else {
            latePolicyNode = late_policy.map((p, i) => {
                // prefer common keys (penalty, time, policy_date)
                const penalty = p?.penalty ?? p?.penalty_percentage ?? null;
                const time = p?.time ?? p?.policy_date ?? null;
                const parts = [];
                if (penalty !== null && penalty !== undefined && String(penalty) !== "") parts.push(`${penalty}%`);
                if (time !== null && time !== undefined && String(time) !== "") parts.push(`${time}`);
                const text = parts.length > 0 ? parts.join(' @ ') : JSON.stringify(p);
                return (
                    // small inline element for each policy
                    <span key={p.id ?? i} style={{display: 'inline-block', marginLeft: i ? 6 : 0}}>{text}</span>
                );
            });
        }
    } else if (late_policy && typeof late_policy === 'object') {
        const penalty = late_policy.penalty ?? late_policy.penalty_percentage ?? null;
        const time = late_policy.time ?? late_policy.policy_date ?? null;
        const parts = [];
        if (penalty !== null && penalty !== undefined && String(penalty) !== "") parts.push(`${penalty}%`);
        if (time !== null && time !== undefined && String(time) !== "") parts.push(`${time}`);
        latePolicyNode = parts.length > 0 ? parts.join(' @ ') : JSON.stringify(late_policy);
    } else {
        latePolicyNode = late_policy ?? t('None');
    }
    return (
        <Box tabIndex={0} sx={{ 
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
            <Box sx={{mt: 0.75 }}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', lineHeight: 1.1 }}>
                    {t('Late Policy')}{' '}
                    {latePolicyNode}
                </Typography>
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

export default React.memo(EventCard);