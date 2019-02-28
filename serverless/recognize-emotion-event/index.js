const axios = require('axios')
console.log('Loading function from recognize emotion event')

function return_highestvalue_from_obj(object) {
  // console.log(object, 'ini object dari r erturrn highest')
  var temp = { emotions: null, score: 0 };
  for (const key in object) {
    if (object[key] > temp['score']) {
      temp['emotions'] = key
      temp['score'] = object[key]
    }
  }
  return temp;
}


exports.handler = async (event, context) => {
    console.log(JSON.stringify(event))
    let bucket =  event['Records'][0]['s3']['bucket']['name'];
    console.log(bucket)
    
    console.log(event['Records'][0]['s3']['object']['key'])
    let url = `https://s3.amazonaws.com/${bucket}/${event['Records'][0]['s3']['object']['key']}`
    try {
    const params = {
        'returnFaceId': 'true',
        'returnFaceLandmarks': 'false',
        'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
            'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
    };
    const subscripsion = "402e0bd57a79415e9b7fef8f8c5111d1"
    const uriBase = 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect';

    
      console.log(url)
      const {data} = await axios({
        method : 'post',
        url: uriBase,
        data: {url},
        headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : subscripsion
        },
        params
      })
      
      
    let result = data.map((e) => {
      return {
        all_emotions: e['faceAttributes'].emotion,
        appealing_emotion: return_highestvalue_from_obj(e['faceAttributes'].emotion)
      }
    })
      
      console.log(JSON.stringify(data))
      console.log(JSON.stringify(result))
    }
    catch(e) {
      throw e;
    }
  // return response;
};

