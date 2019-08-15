export const formatLocationSearch=(search)=>{
  const arr=search.substr(1).split('&');
  const query={};
  arr.forEach(item=>{
    let arr=item.split('=');
    query[arr[0]]=arr[1]
  });
  return query;
};
