import React, { useState, useRef, useEffect, useCallback } from "react";
import { styled } from "styled-components";
import axios from "axios";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Options } from "../../lib/with-session";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import { getWishText, recordEvent } from "../../lib/api";
import { IconButton } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Combo from "../combo-text";
const ToolbarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; 
  align-items: center;
 
  margin-top: 40px;

`;

const ToolbarButton = styled(IconButton)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size:48px;
  
`;

const ToolbarText = styled.span`
  font-size: 16px;
  
`;

const Textarea = styled(TextareaAutosize)`
  width: 100%;
  height: 100%;
  border: none;
  resize: none;
  overflow: hidden;
  font-size: 1.5rem;
  line-height: 1.5;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  letter-spacing: 0.00938em;
  padding: 0;

  background:inherit;
  color:inherit;
  margin-top: 20px;
  &:focus {
    outline: none;
  }
 `;
interface Props {
    session: Options;
    open: boolean;
    setOpen: (open: boolean) => void;
    handleRegenerateText:any;
    onGreetingChange: (greeting: string) => void;
    
   
}
const TextDialog: React.FC<Props> =({session,open,setOpen,handleRegenerateText,onGreetingChange}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [from, setFrom] = useState(session.from||"");
    const [to, setTo] = useState(session.to||"");
    const [occasion, setOccasion] = useState(session.occasion||"");
    const [naive, setNaive] = useState(session.naive||false);
    const [reflections, setReflections] = useState(session.reflections||"");
    const [instructions, setInstructions] = useState(session.instructions||"");
    const [inastyleof, setInastyleof] = useState(session.inastyleof||"");
    const [language, setLanguage] = useState(session.language||"");
    const [interests, setInterests] = useState(session.interests||""); 
    const [greeting, setGreeting] = useState(session.greeting||"");
    const [num, setNum] = useState(session.num||0);
    const [maxNum, setMaxNum] = useState(session.num||0);
    const [missingOccasion, setMissingOccasion] = useState(false);
    const [expanded, setExpanded] = useState<string | false>('none');
    const handleAccordeonChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
     
      //setTimeout(async () => await recordEvent(session.sessionid, 'accordion', panel), 1000);

        };
    const onSave = useCallback(async () => {
      handleRegenerateText({ from,
        to,
        occasion,
        naive,
        reflections,
        instructions,
        inastyleof,
        num,
        maxNum,
        language});
        setOpen(false);
    }, []);
    const generateText = useCallback(async () => {
        setTimeout(async ()=>await recordEvent(session.sessionid, 'generate',JSON.stringify({
            from,
            to,
            occasion,
            naive,
            reflections,
            instructions,
            inastyleof,
            language,
            fresh:true,
            sessionid:session.sessionid,
          },null,4)),1000);
          console.log("handleGenerate====>",session);
          const {content:result,num} = await getWishText({
            style: "",
            from,
            to,
            occasion,
            naive,
            reflections,
            instructions,
            inastyleof,
            language,
            fresh:true,
            sessionid:session.sessionid,
          });
         
          console.log("handleGenerate=>", result,num);
          setGreeting(result);
          setNum(num);
          setMaxNum(num);

         // return {greeting:result,num}
    },[])
    let text=greeting;
    if (!text)
      text = JSON.stringify({ headline: "", body: "" });
  text = text.replace(/\n\n/g, '\n');
  const structuredText = JSON.parse(text);
  // console.log("structuredText=", structuredText)
  //const tw = text.split('\n');

  const headline = structuredText.headline || "";//tw.length > 1 ? tw[0] : '';
  const body = structuredText.body || "";
    return <Dialog fullScreen={fullScreen}  
    open={open}
    onClose={()=>setOpen(false)}
    aria-labelledby="responsive-dialog-title">
       <DialogTitle>Regenerate Text</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Regenerate card headline and text or select from history.
          </DialogContentText>
          <Combo id="occasion"
              label="Occasion"
              value={occasion}
              error={missingOccasion}
              onChange={ (id: string, value: string)=>{setOccasion(value);setMissingOccasion(false)}}
              helperText="Required for a meaningful result. For example: &ldquo;8th Birthday for a boy&rdquo;, &ldquo;Sweet Sixteen&rdquo;, &ldquo;Illness&rdquo; &ldquo;Death in the family&rdquo;, &ldquo;Christmas&rdquo;, &ldquo;Graduation&ldquo;"
            />
             <Box sx={{ mb: 4, mx:1,color: 'primary', justifyContent: 'flex-end' }}>
              <FormControlLabel
                label={<Typography style={{ color: theme.palette.text.secondary }}>Keep it light-hearted, if possible, with emojis.</Typography>}
                control={
                  <Checkbox
                    sx={{  mx:4,color: 'secondary' }}
                    checked={naive==true?false:true}
                    onChange={ (event: React.ChangeEvent<HTMLInputElement>) => {setNaive(!event.target.checked)}}
                  />
                }
              />
            </Box>
    
             {false&& <Accordion style={{ borderRadius: 14 }} sx={{ mt: 5 }} expanded={expanded === 'custom'} onChange={handleAccordeonChange('custom')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>Customize</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ borderRadius: 14 }}>
                  <Box sx={{ my: 4 }}>
                    <TextField
                      sx={{ width: { xs: 1 } }}
                      id="to"
                      label="To (Recepient)"
                      value={to}
                      onChange={(event: any) => {
                        const value = event.target.value;
                        setTo(value);
                      }}
                      helperText="Examples: &ldquo;Our nephew Billy&rdquo;, &ldquo;My Grandson Evan&rdquo;, &ldquo;My Love&rdquo; &ldquo;Love of My Life&rdquo;, &ldquo;Simpsons&rdquo;, &ldquo;Mr Williams, the postman.&ldquo;"
                    />
                  </Box>
                  <Box sx={{ my: 4 }}>
                    <TextField
                      sx={{ width: { xs: 1 } }}
                      id="from"
                      label="From"
                      value={from}
                      onChange={(event: any) => {
                        const value = event.target.value;
                        setFrom(value);
                      }}
                      helperText="Optional: who is the greeting from? For example - Grandma and Grandpa, Your Dad, etc."
                    />
                  </Box>
                </AccordionDetails>
              </Accordion> }
              
              <Accordion sx={{ my: 5,width:'100%' }} expanded={expanded === 'advanced'} onChange={handleAccordeonChange('advanced')}>
                <AccordionSummary
                sx={{p:0,width:'100%' }} 
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography sx={{ px:1,width: '100%', flexShrink: 0 }}>Advanced Inputs</Typography>
                </AccordionSummary>
                <AccordionDetails >
                  <Box sx={{ my: 4 }}>
                    <TextField
                      sx={{ width: { xs: 1 } }}
                      id="to"
                      label="To (Recepient)"
                      value={to}
                      onChange={(event: any) => {
                        const value = event.target.value;
                        setTo(value);
                      }}
                      helperText="Examples: &ldquo;Our nephew Billy&rdquo;, &ldquo;My Grandson Evan&rdquo;, &ldquo;My Love&rdquo; &ldquo;Love of My Life&rdquo;, &ldquo;Simpsons&rdquo;, &ldquo;Mr Williams, the postman.&ldquo;"
                    />
                  </Box>
                  <Box sx={{ my: 4 }}>
                    <TextField
                      sx={{ width: { xs: 1 } }}
                      id="from"
                      label="From"
                      value={from}
                      onChange={(event: any) => {
                        const value = event.target.value;
                        setFrom(value);
                      }}
                      helperText="Optional: who is the greeting from? For example - Grandma and Grandpa, Your Dad, etc."
                    />
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <TextField
                      sx={{ width: { xs: 1 } }}
                      id="reflections"
                      label="Additional Reflections,Thoughts"
                      value={reflections}
                      onChange={(event: any) => {
                        const value = event.target.value;
                        setReflections(value);
                      }}
                      helperText="Any thoughts that you have about what should be reflected in the greeting. For example: 'Always thinking of you', 'We miss you', 'We are so proud of you', 'We are so happy for you', 'We are so sorry for your loss', 'Say Hi to your family'"
                    />
                  </Box>
                  <Box sx={{ my: 4 }}>
                    <TextField
                      sx={{ width: { xs: 1 } }}
                      id="instructions"
                      label="Instructions to AI"
                      value={instructions}
                      onChange={(event: any) => {
                        const value = event.target.value;
                        setInstructions(value);
                      }}
                      helperText="Example: 'Keep it very short', 'Create a headline and plenty of emoticons', 'Do not wish cake', ' As a methodist prayer', 'As a Hebrew prayer', 'No special day'"
                    />
                  </Box>
                  <Box sx={{ my: 4 }}>
                    <TextField
                      sx={{ width: { xs: 1 } }}
                      id="inastyleof"
                      label="Use AI to write in the style of"
                      value={inastyleof}
                      onChange={(event: any) => {
                        const value = event.target.value;
                        setInastyleof(value);
                      }}
                      helperText="Example: 'Mark Twain'.'Dr Seuss', 'Shakespeare', 'King David', 'The Simpsons', 'The Bible'. You can upload an image of a character or a person to go with the styled greeting."
                    />
                  </Box>
                  <Box sx={{ my: 4 }}>
                    <TextField
                      sx={{ width: { xs: 1 } }}
                      id="language"
                      label="Language"
                      value={language}
                      onChange={(event: any) => {
                        const value = event.target.value;
                        setLanguage(value);
                      }}
                      helperText="Example: 'French', 'Ukrainian', 'Middle-English', 'Canadian'"
                    />
                  </Box>
                </AccordionDetails>
              </Accordion> 
              <ToolbarContainer data-id="toolbar-generate">
      <ToolbarButton color={"success"} size="large" onClick={generateText}>
     
        <TextFieldsIcon />
        <ToolbarText>Generate Wish Text</ToolbarText>
      </ToolbarButton>
      </ToolbarContainer>
              <Textarea defaultValue={headline}/>
              <Textarea defaultValue={body}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={ ()=>setOpen(false)}>Cancel</Button>
          <Button onClick={ ()=>generateText()}>Generate</Button>
          <Button onClick={ ()=>onSave()}>Save</Button>
        </DialogActions>

      </Dialog>
      ;
}
export default TextDialog;