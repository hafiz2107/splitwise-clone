module.exports = {
    success : (serverResponse,message="Successfull", data=null) => {
        serverResponse.json({
        success: true,
        status : 200,
        ecode: 0,
        message: message,
        data: data,
      });
    },
    
    failed :(serverResponse,message="Something went wrong", data=null ) => {
        serverResponse.json({
          success: false,
          status:400,
          ecode: 1,
          message: message,
          data: data,
        });
      },
    
    noRecords :(serverResponse,message="No records Found", data=null )=>{
      serverResponse.json({
        success : true,
        status:204,
        ecode:0,
        message,
        data
      })
    }
}