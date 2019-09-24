/**
 * 根据一组点位([纬度，经度])计算出中心点
 * @param pointArray
 * @returns {*[]}
 */
const calculateCenterPoint=(pointArray)=>{
  const sortedLongitudeArray=pointArray.map(item=>item.lng).sort();
  const sortedLatitudeArray=pointArray.map(item=>item.lat).sort();
  const centerLongitude=((sortedLongitudeArray[0]+sortedLongitudeArray[sortedLongitudeArray.length-1])/2).toFixed(4);
  const centerLatitude=((sortedLatitudeArray[0]+sortedLatitudeArray[sortedLatitudeArray.length-1])/2).toFixed(4);
  return [centerLongitude,centerLatitude];
};

export default calculateCenterPoint;
