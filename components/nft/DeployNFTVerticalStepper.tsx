import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Link from 'next/link';
import { useMoralis } from 'react-moralis';

const steps = [
    {
        label: 'Config your NFT smart contract',
        description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
    },
    {
        label: 'Review the metadata and parameters',
        description:
            'An ad group contains one or more ads which target a shared set of keywords.',
    },
    {
        label: 'Upload the metadata to decentralized database',
        description: ``,
    },
    {
        label: 'Deploy your NFT smart contract',
        description: ``,
    },
];

export default function DeployNFTVerticalStepper({ goBack, deploy, contract, post }) {
    const [activeStep, setActiveStep] = React.useState(0);
    const { Moralis } = useMoralis();
    const [name, setName] = React.useState("");
    const [symbol, setSymbol] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState(0);
    const [maxSupply, setMaxSupply] = React.useState(100);
    const [metadataUri, setMetadataUri] = React.useState("");
    const [deploying, setDeploying] = React.useState(false);
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const uploadMetadata = async () => {
        const object = {
            name,
            description,
            symbol,
            price,
            attributes: [],
            image: post?.data?.imageUrl,
        };
        console.log(object);
        const metadataFile = new Moralis.File("file.json", {
            base64: btoa(JSON.stringify(object)),
        });
        await metadataFile.saveIPFS();
        setMetadataUri(metadataFile.ipfs());
        console.log(metadataFile.ipfs());
    }

    return (
        <Box sx={{ maxWidth: 400 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                        // optional={
                        //     index === 2 ? (
                        //         <Typography variant="caption">Last step</Typography>
                        //     ) : null
                        // }
                        >
                            {step.label}
                        </StepLabel>
                        <StepContent>
                            {
                                index === 0 &&
                                <div className='flex flex-col'>
                                    <TextField id="standard-basic" required label="Name" variant="standard" onChange={(e) => { setName(e.target.value) }} value={name} />
                                    <TextField id="standard-basic" required label="Symbol" variant="standard" onChange={(e) => { setSymbol(e.target.value) }} value={symbol} />
                                    <TextField id="standard-basic" label="Description" variant="standard" onChange={(e) => { setDescription(e.target.value) }} value={description} />
                                    <TextField id="standard-basic" type="number" label="Price [ETH] (default is free mint)" variant="standard" onChange={(e) => { setPrice(e.target.value) }} value={price} />
                                    <TextField id="standard-basic" type="number" label="Total supply (default is 100)" variant="standard" onChange={(e) => { setMaxSupply(e.target.value) }} value={maxSupply} />
                                </div>
                            }
                            {
                                index == 1 &&
                                <div className='flex flex-col'>
                                    <TextField id="standard-basic" required label="Name" variant="standard" value={name} InputProps={{
                                        readOnly: true,
                                    }} />
                                    <TextField id="standard-basic" required label="Symbol" variant="standard" value={symbol} InputProps={{
                                        readOnly: true,
                                    }} />
                                    <TextField id="standard-basic" type="number" label="Price" variant="standard" value={price} InputProps={{
                                        readOnly: true,
                                    }} />
                                    <TextField id="standard-basic" type="number" label="Total supply" variant="standard" value={maxSupply} InputProps={{
                                        readOnly: true,
                                    }} />
                                </div>
                            }
                            {
                                index == 2 &&
                                <div className=''>
                                    <div>
                                        <LoadingButton
                                            loading={deploying}
                                            loadingPosition="center"
                                            // variant="contained"
                                            onClick={uploadMetadata}
                                        >
                                            Upload now
                                        </LoadingButton>
                                    </div>
                                    {
                                        metadataUri.length > 0 && <Link href={metadataUri} >
                                            <a target="_blank" className='underline text-sm text-sky-600'>
                                                Review your metadata in decentrilized database (IPFS)
                                            </a>
                                        </Link>
                                    }
                                </div>

                            }

                            {
                                index == 3 &&
                                <div>
                                    {
                                        (contract.length == 0 || deploying) &&
                                        <LoadingButton
                                            loading={deploying}
                                            loadingPosition="center"
                                            // variant="contained"
                                            onClick={async () => {
                                                setDeploying(true);
                                                await deploy({
                                                    name,
                                                    symbol,
                                                    metadataUri,
                                                    price,
                                                    maxSupply
                                                })
                                                setDeploying(false);
                                            }}
                                        >
                                            Deploy now
                                        </LoadingButton>
                                    }

                                    {
                                        contract.length > 0 &&
                                        <div className='text-xm'>
                                            contract address: {contract}
                                        </div>
                                    }

                                </div>


                            }

                            <Box sx={{ mb: 2, mt: 2 }}>
                                <div>
                                    <Button
                                        variant="outlined"
                                        onClick={handleNext}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                    </Button>
                                    <Button
                                        disabled={index === 0}
                                        onClick={handleBack}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                    <div className='text-sm'>🎉 You launched your design as NFT successfully 🎉  </div >
                    <div className='text-sm' >contract address: {contract}  </div >
                    {/* {
                                        contract.length > 0 &&
                                        <div className='text-xm'>
                                            
                                        </div>
                                    } */}
                </Paper>
            )
            }

            <Button onClick={goBack} sx={{ mt: 3, mr: 1 }}>
                Go back
            </Button>
        </Box >
    );
}