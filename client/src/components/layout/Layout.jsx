import  './Layout.css'
import { Skeleton } from '@mui/material';

export const Layout = () => {
  return (
    <div className='chatPageLayout'>
    <div className="leftPageLayout">
      <div className="topBarLayout">
       <div className="leftTopLayout">
        <Skeleton variant='circular' width={45} height={45} animation="wave"/>
        <Skeleton variant='rounded' height={60} width={380} animation="wave"/>
       </div>
      <div className="leftBottomLayout">
        <Skeleton variant='text' sx={{fontSize:"30px"}} animation="wave"/>
      </div>
      </div>
      <div className="leftCenterLayout">
        <Skeleton variant='rounded' height={485} width={"100%"} animation="wave"/>
      </div>
    </div>
      <div className="rightPageLayout">
        <Skeleton variant='rounded' style={{margin:"10px 0 20px 0"}} width={"100%"} height={65}  animation="wave"/>
        <Skeleton variant='rounded' width={"100%"} style={{marginBottom:"20px"}} height={450}  animation="wave"/>
        <Skeleton variant='rectangular' width={"100%"} height={60} animation="wave"/> 
      </div>  
  </div>
  )
}
