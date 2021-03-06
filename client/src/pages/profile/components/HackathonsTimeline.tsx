import { Box, Flex, Text } from '@chakra-ui/core';
import * as _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import styled from 'styled-components';
import { Hackathon } from '../../../models/Models';
import colors, { getRandomColorHex, getTextContrast } from '../../../utils/colors';
import { Link } from 'react-router-dom';

export default function HackathonsTimeline({ hackathons }: { hackathons: Hackathon[] }) {
    const elementColors = React.useMemo(() => {
        return hackathons.map(() => {
            const bg = getRandomColorHex();
            const textColor = getTextContrast(bg);

            return { bg: bg, textColor: textColor };
        });
        /*
         *   Used to keep the same colors after a re-render
         */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <StyledBox w='100%' pb='20px'>
            <VerticalTimeline layout='2-columns' className='vertical-timeline-custom-line'>
                {hackathons.map((hack, index) => (
                    <VerticalTimelineElement
                        className='vertical-timeline-element'
                        contentStyle={{
                            background: elementColors[index].bg,
                            color: elementColors[index].textColor,
                            padding: '10px 30px',
                        }}
                        contentArrowStyle={{
                            borderRight: '7px solid ' + colors.black_almost,
                        }}
                        iconStyle={{
                            boxShadow: `0 0 0 4px ${colors.black}, inset 0 2px 0 rgba(0,0,0,.08), 0 3px 0 4px rgba(0,0,0,.05)`,
                            backgroundColor: elementColors[index].bg,
                        }}
                        date={formatHackathonPeriod(hack)}
                        dateClassName='date-color'
                        key={index}>
                        <Link to={`/hackathons/${hack._id}`}>
                            <Flex justify='space-between'>
                                <Box>
                                    <Text>{hack?.name}</Text>
                                    <Text>{hack?.description.substring(0, 50)}...</Text>
                                </Box>
                            </Flex>
                        </Link>
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
        </StyledBox>
    );
}

const StyledBox = styled(Box)`
    .vertical-timeline.vertical-timeline-custom-line::before {
        background: ${colors.black_almost};
    }

    .date-color {
        @media only screen and (min-width: 1170px) {
            color: ${colors.black};
            padding-left: 10px;
        }
    }
`;

function formatHackathonPeriod(hackathon: Hackathon) {
    const outputFormat = 'DD/MM/yyyy';
    const from = moment(hackathon?.startDate).locale('it').format(outputFormat);
    const to = moment(hackathon?.endDate).locale('it').format(outputFormat);
    return `${_.capitalize(from)} - ${_.capitalize(to)}`;
}
