// Helper function to extract YouTube ID from URL
const extractYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  
  src={`https://www.youtube.com/embed/${currentVideo.youtubeId || extractYoutubeId(currentVideo.videoUrl)}`}


  // try {
          //     setLoanData({ ...values });
          //     setLoader(true);
          //     setErrorMessage("");
              
          //     const response = await fetch(`${ENV.API_URL}/finance-loan-details`, {
          //         method: "POST",
          //         headers: {
          //             "Content-Type": "application/json",
          //             "Accept": "application/json"
          //         },
          //         body: JSON.stringify(values),
          //     });
  
          //     const result = await response.json();
  
          //     if (response.ok) {
          //         setLoader(false);
          //         setStep(step + 1);
          //     } else {
          //         setErrorMessage(result?.message);
          //         setLoader(false);
          //     }
          // } catch (error) {
          //     setErrorMessage("Error submitting data: " + error.message);
          //     setLoader(false);
          // }