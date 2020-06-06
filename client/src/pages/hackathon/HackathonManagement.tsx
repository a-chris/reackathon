import {
    Accordion,
    AccordionHeader,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    PseudoBox,
    Text,
    Textarea,
} from '@chakra-ui/core';
import * as _ from 'lodash';
import moment from 'moment';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { AppContext } from '../../AppContext';
import { HackathonStatus, NewHackathon, User } from '../../models/Models';
// TODO find a better solution
import { fakeLocation } from '../../models/TempDemoModels';
import { createHackathon } from '../../services/HackathonService';
import colors from '../../utils/colors';

const AccordionHeaderStyle = {
    fontWeight: '700',
    bg: colors.yellow,
    borderRadius: 5,
};

const initialPrizeData = {
    amount: 0,
    extra: '',
};

function initialHackathonData(user: User) {
    const date = moment();
    return {
        name: '',
        description: '',
        attendantsRequirements: {
            description: '',
        },
        organization: user,
        startDate: date.add(7, 'days').toDate(),
        endDate: date.add(1, 'days').toDate(),
        location: fakeLocation, //TODO remove fake value
        prize: initialPrizeData,
        status: HackathonStatus.PENDING,
    };
}

export default function HackathonManagement() {
    const appContext = React.useContext(AppContext);
    console.log('TCL: HackathonManagement -> appContext.state', appContext.state);
    const [hackathonData, setHackathonData] = React.useState<NewHackathon>(
        initialHackathonData(appContext.state!.user!)
    );
    const [loading, setLoading] = React.useState<boolean>(false);
    const [allValuesValid, setAllValuesValid] = React.useState<boolean>(false); //TODO add validation effect and set initial value to false
    const [dateError, setDateError] = React.useState<boolean>(false);
    const [missingData, setMissingData] = React.useState<string[]>([]);
    // const [prizeError, setPrizeError] = React.useState<boolean>(false);

    React.useEffect(() => {
        const allValid = _.every(new Set([dateError])) && missingData.length === 0;
        setAllValuesValid(allValid);
    }, [dateError, missingData]);

    React.useEffect(() => {
        setMissingData(
            Object.entries(hackathonData)
                .filter((el) => el[1] === undefined || el[1] === '')
                .map((el) => el[0])
        );
    }, [hackathonData]);

    React.useEffect(() => {
        if (hackathonData.startDate && hackathonData.endDate) {
            const tomorrow = moment().add(1, 'days').toDate().getTime();
            let error =
                hackathonData.startDate.getTime() < tomorrow ||
                hackathonData.startDate.getTime() >= hackathonData.endDate.getTime();
            setDateError(error);
        }
    }, [hackathonData.startDate, hackathonData.endDate]);

    const onChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            setHackathonData((curr) => ({ ...curr, [name]: value }));
        }
    };

    const onChangeRequirements = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            setHackathonData((curr) => ({
                ...curr,
                attendantsRequirements: { ...curr.attendantsRequirements, [name]: value },
            }));
        }
    };

    const onChangePrize = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            setHackathonData((curr) => ({ ...curr, prize: { ...curr.prize, [name]: value } }));
        }
    };

    const onDateChange = (date: Date, name: string) => {
        setHackathonData((curr) => ({ ...curr, [name]: date }));
    };

    const onHackathonCreation = React.useCallback(() => {
        setLoading(true);
        createHackathon(hackathonData)
            .then((hackathon) => {
                setLoading(false);
                console.log(hackathon); //TODO handle
            })
            .catch((error) => console.log(error));
    }, [hackathonData]);

    return (
        <StyledHackathonContainer>
            <PseudoBox fontSize='1.8em' fontWeight='semibold' m={3} textAlign='left'>
                Creazione Hackathon
            </PseudoBox>

            <Accordion defaultIndex={[0]} allowMultiple>
                <AccordionItem>
                    <AccordionHeader {...AccordionHeaderStyle}>
                        <Box flex='1' textAlign='left'>
                            Descrizione dell'evento
                        </Box>
                        <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                        <FormControl isRequired textAlign='left'>
                            <FormLabel htmlFor='name'>Nome dell'evento</FormLabel>
                            <Input
                                id='name'
                                name='name'
                                textAlign='left'
                                value={hackathonData.name}
                                onChange={onChangeValue}
                                placeholder='clicca per modificare...'
                                border={'1px solid ' + colors.gray}
                                borderRadius='0.25em'
                                p={2}
                                pl={4}
                            />
                        </FormControl>

                        <FormControl isRequired textAlign='left'>
                            <FormLabel htmlFor='description'>Descrizione</FormLabel>
                            <Textarea
                                id='description'
                                name='description'
                                placeholder='clicca per modificare...'
                                value={hackathonData.description}
                                onChange={onChangeValue}
                            />
                        </FormControl>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <AccordionHeader {...AccordionHeaderStyle}>
                        <Box flex='1' textAlign='left'>
                            Orari e location
                        </Box>
                        <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                        <FormControl isInvalid={dateError}>
                            <Box display={{ md: 'flex' }}>
                                <FormControl isRequired textAlign='left' pr={4}>
                                    <FormLabel htmlFor='startDate'>Data di inizio</FormLabel>
                                    <StyleDataPickerDiv>
                                        <DatePicker
                                            id='startDate'
                                            showTimeSelect
                                            showTimeInput
                                            selected={hackathonData.startDate}
                                            onChange={(date: Date) =>
                                                onDateChange(date, 'startDate')
                                            }
                                            dateFormat='dd/MM/yyyy HH:mm'
                                        />
                                    </StyleDataPickerDiv>
                                </FormControl>
                                <FormControl isRequired textAlign='left'>
                                    <FormLabel htmlFor='endDate'>Data di fine</FormLabel>
                                    <StyleDataPickerDiv>
                                        <DatePicker
                                            id='endDate'
                                            showTimeSelect
                                            showTimeInput
                                            selected={hackathonData.endDate}
                                            onChange={(date: Date) => onDateChange(date, 'endDate')}
                                            dateFormat='dd/MM/yyyy HH:mm'
                                        />
                                    </StyleDataPickerDiv>
                                </FormControl>

                                <FormErrorMessage>
                                    {`L'Hackathon deve essere creato almeno un giorno prima dell'inizio dell'evento,\
                                     e la data di inizio deve essere inferiore a quella di fine.`}
                                </FormErrorMessage>
                            </Box>
                            <FormControl isRequired textAlign='left'>
                                <FormLabel htmlFor='location'>Luogo</FormLabel>
                                <Input
                                    id='location'
                                    name='location'
                                    textAlign='left'
                                    defaultValue={Object.entries(hackathonData.location).map(
                                        (v: any) => v[1]
                                    )} //TODO add address autocomplete
                                    isReadOnly={true}
                                    // onChange={onChangeValue}
                                    placeholder='clicca per modificare...'
                                    p={2}
                                    pl={4}
                                />
                            </FormControl>
                        </FormControl>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <AccordionHeader {...AccordionHeaderStyle}>
                        <Box flex='1' textAlign='left'>
                            Requisiti per partecipare
                        </Box>
                        <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                        <FormControl isRequired textAlign='left'>
                            <FormLabel htmlFor='description'>
                                Requisiti richiesti ai partecipanti
                            </FormLabel>
                            <Textarea
                                id='requirements_description'
                                name='description'
                                placeholder='clicca per modificare...'
                                value={hackathonData.attendantsRequirements.description}
                                onChange={onChangeRequirements}
                            />
                        </FormControl>

                        <Box display={{ md: 'flex' }}>
                            <FormControl textAlign='left' pr={4}>
                                <FormLabel htmlFor='startDate'>
                                    Numero minimo di partecipanti
                                </FormLabel>
                                <Input
                                    id='minNum'
                                    name='minNum'
                                    type='number'
                                    placeholder='-'
                                    value={hackathonData.attendantsRequirements.minNum || ''}
                                    onChange={onChangeRequirements}
                                />
                            </FormControl>

                            <FormControl textAlign='left'>
                                <FormLabel htmlFor='startDate'>
                                    Numero massimo di partecipanti
                                </FormLabel>
                                <Input
                                    id='maxNum'
                                    name='maxNum'
                                    type='number'
                                    placeholder='-'
                                    value={hackathonData.attendantsRequirements.maxNum || ''}
                                    onChange={onChangeRequirements}
                                />
                            </FormControl>
                        </Box>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <AccordionHeader {...AccordionHeaderStyle}>
                        <Box flex='1' textAlign='left'>
                            Premi
                        </Box>
                        <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                        <FormControl isRequired textAlign='left'>
                            <FormLabel htmlFor='startDate'>Premio in denaro</FormLabel>
                            <Input
                                id='amount'
                                name='amount'
                                type='number'
                                value={hackathonData.prize.amount}
                                onChange={onChangePrize}
                            />
                        </FormControl>

                        <FormControl textAlign='left' pr={4}>
                            <FormLabel htmlFor='extra'>Altre informazioni</FormLabel>
                            <Input
                                id='extra'
                                name='extra'
                                value={hackathonData.prize.extra}
                                onChange={onChangePrize}
                            />
                        </FormControl>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>

            <Button
                isLoading={loading}
                isDisabled={!allValuesValid}
                m={3}
                mb={0}
                borderColor={colors.orange_light}
                border='2px'
                variant='outline'
                onClick={onHackathonCreation}
                type='button'>
                Salva
            </Button>
            {!allValuesValid && (
                <Text>
                    <small>Inserisci tutte le informazioni richieste per poter procedere</small>
                </Text>
            )}
        </StyledHackathonContainer>
    );
}

const StyledHackathonContainer = styled.div`
    background-color: ${colors.white};
    margin: 2%;
    border: 3px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px;
`;

const StyleDataPickerDiv = styled.div`
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    width: fit-content;
    padding: 8px;
`;
