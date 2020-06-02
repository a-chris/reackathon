import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Box, Text, Badge, Stack, Heading, Grid } from '@chakra-ui/core';
import { Hackathon, HackathonStatus } from '../../models/Models';
import { getHackathons } from '../../services/HackathonService';
import queryString from 'query-string';
import { MapContainer } from '../../components/Map';
import { red_light, gray, black } from '../../utils/colors';

type RouteParams = {
    city?: string;
    address?: string;
};

const ROUTE_PARAMS = new Set(['city', 'address']);

export default function HackathonsList() {
    const [hackathons, setHackathons] = React.useState<Hackathon[]>([]);
    const [filters, setFilters] = React.useState<RouteParams>();
    const location = useLocation();

    React.useEffect(() => {
        const urlFilters = sanitizeRouteParams(queryString.parse(location.search));
        setFilters((curr) => {
            const val = { ...curr, ...urlFilters };
            return val;
        });
    }, [, location]);

    React.useEffect(() => {
        getHackathons(filters).then((hackathons) => setHackathons(hackathons));
    }, [filters]);

    return (
        <Box w={'100%'} h={'100%'}>
            <Grid w={'100%'} h={'100%'} templateColumns='repeat(2, 5fr)'>
                <Stack w={['100%', '100%']} p={[25, 25, 15, 5]} overflowY='auto'>
                    <Box color={red_light}>
                        <Heading as='h2' size='lg'>
                            Hackathons
                        </Heading>
                    </Box>
                    {hackathons.map((hackathon, index) => (
                        <Box p={2} color='gray.500' border={'2px solid ' + gray} textAlign='left'>
                            <Link key={hackathon._id} to={'hackathons/' + hackathon._id}>
                                <Heading as='h3' size='lg'>
                                    {hackathon.name} ddddd fdgsrth ehath
                                </Heading>
                                <Box color='gray.400'>
                                    {hackathon.description} vsdvjns dfbjang grjgneiogn rgjnegion
                                    nethnrthn egrghneoithn ejnhjtrnhe erjnhoietnhi
                                </Box>
                                <Box d='flex' alignItems='baseline' justifyContent='space-between'>
                                    <Box
                                        color='gray.500'
                                        fontWeight='semibold'
                                        letterSpacing='wide'
                                        fontSize='xs'
                                        textTransform='uppercase'>
                                        {hackathon.location.city} &bull;{' '}
                                        {hackathon.location.country}
                                    </Box>
                                    {StatusBadge(hackathon.status)}
                                </Box>
                            </Link>
                        </Box>
                    ))}
                </Stack>
                <Box w={['100%', '100%', '100%', '100%']} p={2}>
                    <MapContainer hackathons={hackathons} style={{ width: '100%' }} />
                </Box>
            </Grid>
        </Box>
    );
}

function sanitizeRouteParams(params: any): RouteParams {
    let newParams: any = {};
    Object.entries(params)
        .filter((e) => ROUTE_PARAMS.has(e[0]))
        .forEach((e) => {
            newParams[e[0]] = e[1];
        });
    return newParams;
}

function StatusBadge(status: HackathonStatus) {
    let color = 'green';
    let text = '';

    switch (status) {
        case HackathonStatus.PENDING:
            color = 'yellow';
            text = 'iscriviti';
            break;
        case HackathonStatus.STARTED:
            color = 'green';
            text = 'in corso';
            break;
        case HackathonStatus.FINISHED:
            color = 'red';
            text = 'concluso';
            break;
    }
    if (text === '') return;

    return (
        <Badge variant='outline' rounded='full' mr={3} variantColor={color}>
            {text}
        </Badge>
    );
}
