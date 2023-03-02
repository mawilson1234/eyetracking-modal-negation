PennController.ResetPrefix(null) // Keep this here

// IMPORTANT NOTE: when running this project, the eye-tracker will highlight
// the element that it estimates the participant is looking at
// Edit the file PennController.css in the Aesthetics folder to remove highlighting
//
// NOTE: this template will not *actually* collect eye-tracking data,
//       because the command EyeTrackerURL below points to a dummy URL in the

// Resources are hosted as ZIP files on a distant server
PreloadZip("https://campuspress.yale.edu/michaelwilson/2023/03/audio.zip")
PreloadZip("https://campuspress.yale.edu/michaelwilson/2023/03/images.zip")

// Replace the URL with one that points to a PHP script that you uploaded to your webserver
// see: https://doc.pcibex.net/how-to-guides/collecting-eyetracking-data/#php-script
// EyeTrackerURL("https://dummy.url/script.php")

// currently 0 for debugging/testing script functionality
var REQUIRED_ACCURACY = 0
var MAX_CALIBRATION_ATTEMPTS = 2

// Welcome page: we do a first calibration here---meanwhile, the resources are preloading
newTrial("check",
    newText(
        '<p>This experiment needs to access your webcam to follow your ' +
        'eye movements.</p>' +
        '<p>We will only collect data on where on this page your eyes ' +
        'are looking during the experiment.</p>'
    )
        .center()
        .print()
    ,
    
    newButton("I understand. Start the experiment")
        .center()
        .print()
        .wait( newEyeTracker("tracker").test.ready() )
        .remove()
    ,
    
    clear()
    ,
    
    fullscreen()
    ,
    
    getEyeTracker("tracker")
        .calibrate(REQUIRED_ACCURACY, MAX_CALIBRATION_ATTEMPTS)
    ,
    
    newText(
        '<p>You will see the same button in the middle of the screen ' +
        'before each trial.</p>' +
        '<p>Click and fixate it for 3 seconds to check that the tracker ' +
        'is still well calibrated.</p>' +
        '<p>If it is, the trial will start after 3 seconds. Otherwise, ' +
        'you will go through calibration again.</p>'
    )
        .center()
        .print()
    ,
    
    newButton("Go to the first trial")
        .center()
        .print()
        .wait()
)

// Wait if the resources have not finished preloading 
// by the time the tracker is calibrated
CheckPreloaded()

Template("Modalnegationeyetracking_fin.csv", row =>
    newTrial("trial",
        newEyeTracker("tracker")
            .calibrate(REQUIRED_ACCURACY, MAX_CALIBRATION_ATTEMPTS)
        ,
        
        newTimer(250)
            .start()
            .wait()
        ,
        
        // We will print two pairs of images, one image on each quadrant of the page
        // The images are 20%-width x 20%-height of the page, but each pair is contained
        // in a 40% Canvas so as to capture slightly-off gazes
        defaultImage.size("20vh", "20vh")
        ,
        
        // newCanvas("name" , "percentage of screensize in width" , "percentage of screensize in height" )
        newCanvas("upleft", "20vw", "40vh")
            .add( "center at 25%" , "middle at 50%" , newImage(row.image1) )
            .print( "center at 25vw" , "middle at 25vh" )
        ,
        
        newCanvas("upright", "20vw", "40vh")
            .add( "center at 25%" , "middle at 50%" , newImage(row.image2) )
            .print( "center at 25vw" , "middle at 75vh" )
        ,
        
        newCanvas("downleft", "20vw", "40vh")
            .add( "center at 25%" , "middle at 50%" , newImage(row.image3) )
            .print( "center at 75vw" , "middle at 25vh" )
        ,
        
        newCanvas("downright", "20vw", "40vh")
            .add( "center at 25%" , "middle at 50%" , newImage(row.image4) )
            .print( "center at 75vw" , "middle at 75vh" )
        ,
        
        // Print a playbutton in the centre of the screen to play the 
        // Audio since not every Browser supports Autoplay; Alternative to .play()
        // TODO: can we restrict participants to browsers with autoplay for consistency?
        newAudio(row.audio)
            .center() 
            .print()
        ,
        
        getEyeTracker("tracker")
            .add(    
                getCanvas("upleft"),
                getCanvas("upright"),
                getCanvas("downleft"),
                getCanvas("downright")
                 
            )
            .start()
        ,
        
        newTimer(1000)
            .start()
            .wait()
        ,
        
        newAudio("audio", row.audio)
            .log()
            .play()
        ,

        newSelector("answer")
            .add(
                getCanvas("upleft"),
                getCanvas("upright"),
                getCanvas("downleft"),
                getCanvas("downright") 
            )
            .once()
            .log()
            .wait()
        ,
        
        getEyeTracker("tracker")
            .stop()
            .log()
        ,
        
        getAudio("audio")
            .wait("first")
        ,
        
        newTimer(250)
            .start()
            .wait()
    )
        .log('list', row.list)
        .log('sentence', row.sentence)
        .log('type', row.type)
        .log('item', row.item)
        .log('Specificitem', row.Specificitem)
        .log('verb', row.verb)
        .log('Condition', row.Condition)
        .log('Typecondition', row.Typecondition)
        .log('image1', row.image1)
        .log('image2', row.image2)
        .log('image3', row.image3)
        .log('image4', row.image4)
        .log('target-picture', row['target-picture'])
        .log('audio', row.audio)
)

SendResults()

newTrial(
    exitFullscreen()
    ,
    
    newText(
        "This is the end of the experiment, you can " +
        "now close this window. Thank you!"
    )
        .center()
        .print()
    ,
    
    // Not printed: wait on this page forever
    newButton()
        .wait()
)
    .setOption("countsForProgressBar", false)