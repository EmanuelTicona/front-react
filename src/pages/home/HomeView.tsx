import { GenericFrame } from "../../common/Frame/GenericFrame"
import { Button } from "@mui/material";
import { Fragment, useState } from "react";
import { BasicFrame } from "../../common/Frame/BasicFrame";
import { Redirection } from "../../helpers/home.helpers";

/* Images */
// import backgroundImage from "../../../assets/foto.jpg"; como se llama a una imagen `url(${backgroundImage})`,

const HomeView: React.FC= () => {
  const [clicked, setClicked] = useState(false);
  
  const handleClick = () => setClicked(true);

  return (
    <Fragment>
      {/* Home */}
      <GenericFrame className='flex-col' style={{
                backgroundImage: '',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
      }}>
              <BasicFrame className='flex-col'>
                  <Button className={clicked ? 'buttonClicked' : ''} onClick={handleClick} sx={{ fontSize: '1.2em',fontWeight: 300, pr:'5em', pl:'5em', mt:'0.4em' }} variant="text"><span style={{zIndex:3}}>Comenzar</span></Button>
                  {clicked && <Redirection />}
              </BasicFrame>
      </GenericFrame>
    </Fragment>
  )
}

export default HomeView;