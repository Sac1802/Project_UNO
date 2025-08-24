import logs from "../utils/logs.js";

export const eitherLogger = (req, res, next) => {
  const json = res.json;

  res.json = function(body){
    if(body?.isLeft && body.isLeft()){
      logs.error(`Either Left: ${body.left}`)
    }
    return json.call(this, body);
  };

  next();
}
