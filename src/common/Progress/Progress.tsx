import { CircularProgress } from "@mui/material";

const Progress: React.FC = () => {
    return (
        <div style={{ height: '100%', width: '100%', margin:'0', display: 'flex', justifyContent:'center', alignItems: 'center' }}>
                <CircularProgress/>
        </div>
    );
}

export default Progress;