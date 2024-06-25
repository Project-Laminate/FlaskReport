
function addRows() {
    // console.log("Adding rows");
    let report = {
        csvData1: window.reportData.csvData1,
        csvData2: window.reportData.csvData2
    };

    // Remove age and sex from the data
    delete report.csvData1.age;
    delete report.csvData1.sex;
    delete report.csvData2.age;
    delete report.csvData2.sex;

    // Convert object into an array of objects with key and priority
    let dataArray1 = Object.keys(report.csvData1).map(key => {
        return {
            key: key,
            value: report.csvData1[key],
            priority: report.csvData1[key].priority // Use the 'priority' property
        };
    });

    let dataArray2 = Object.keys(report.csvData2).map(key => {
        return {
            key: key,
            value: report.csvData2[key],
            priority: report.csvData2[key].priority // Use the 'priority' property
        };
    });

    // Sort the arrays by priority
    dataArray1.sort((a, b) => a.priority - b.priority);
    dataArray2.sort((a, b) => a.priority - b.priority);


    // Loop through the sorted array and add rows using keys and values
    for (let i = 0; i < dataArray1.length; i++) {
        document.getElementById("table").appendChild(newRow(dataArray1[i].key, dataArray1[i].value, dataArray2[i].value));
        // add height too
    }
}

function calculatePosition(percentile) {
    // Define new boundaries based on standard deviations from the mean
    const boundaries = [
        0,
        5,
        25,
        75,
        95,
        100
    ];
    const pixelWidths = [13, 26, 91, 26, 13];
    let position = 0;
    let accumulatedWidth = 0;

    // Find the index for the percentile range
    const index = boundaries.findIndex((value) => percentile <= value) - 1;

    // Calculate the width covered by the previous segments
    for (let i = 0; i < index; i++) {
        accumulatedWidth += pixelWidths[i];
    }

    // Calculate the position within the current segment
    if (index >= 0) {
        const segmentStartPercentile = boundaries[index];
        const segmentEndPercentile = boundaries[index + 1];
        const segmentWidth = pixelWidths[index];

        // Calculate the percentage of the way through the current segment
        const segmentPercent = (percentile - segmentStartPercentile) / (segmentEndPercentile - segmentStartPercentile);
        // Convert that to a pixel value and add it to the accumulated width
        position = accumulatedWidth + (segmentPercent * segmentWidth);
    } else {
        // If the percentile is less than the first boundary, it's in the first segment
        position = (percentile / boundaries[1]) * pixelWidths[0];
    }

    return position;
}
function newRow(key, value1, value2) {
    let row = document.createElement("div");
    row.innerHTML = `
   <div class="row" style="padding-top: 3px;">
        <b class="display-label">${value1.display}</b>
        <div class="container">
            <div class="row">
                <span class="measure-text">${value1.lh.reading}</span>
                <img src="/static/Arrow1grey.svg" alt="Arrow" width="36" />
                <span class="measure-subtext">${((value2.lh.reading - value1.lh.reading) / value1.lh.reading * 100).toFixed(1)}%</span>
                <span class="measure-text">${value2.lh.reading}</span>
            </div>
            <div class="row">
                <span class="measure-text">${value1.lh.percentile} <sup>pct</sup></span>
                <span class="measure-subtext">${(value2.lh.percentile - value1.lh.percentile).toFixed(1)} <sup>pct</sup></span>
                <img src="/static/Arrow1grey.svg" alt="Arrow" width="36" />
                <span class="measure-text">${value2.lh.percentile} <sup>pct</sup></span>
            </div>
            <div class="percentile-box">
                <div class="bar">
                    <div class="rect-1"></div>
                    <div class="rect-2"></div>
                    <div class="rect-3"></div>
                    <div class="rect-4"></div>
                    <div class="rect-5"></div>
                </div>
                 <!-- <img src="/static/ChangeArrow.svg" id="dynamicArrow" class="change-arrow" alt="Change Arrow" /> -->
                <div class="normal-range-text">(${value2.lh.twentyfifth_percentile} - ${value2.lh.seventyfifth_percentile})</div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <span class="measure-text">${value1.rh.reading}</span>
                <img src="/static/Arrow1grey.svg" alt="Arrow" width="36" />
                <span class="measure-subtext">${((value2.rh.reading - value1.rh.reading) / value1.rh.reading * 100).toFixed(1)}%</span>
                <span class="measure-text">${value2.rh.reading}</span>
            </div>
            <div class="row">
                <span class="measure-text">${value1.rh.percentile} <sup>pct</sup></span>
                <span class="measure-subtext">${(value2.rh.percentile - value1.rh.percentile).toFixed(1)} <sup>pct</sup></span>
                <img src="/static/Arrow1grey.svg" alt="Arrow" width="36" />
                <span class="measure-text">${value2.rh.percentile} <sup>pct</sup></span>
            </div>
            <div class="percentile-box">
                <div class="bar">
                    <div class="rect-1"></div>
                    <div class="rect-2"></div>
                    <div class="rect-3"></div>
                    <div class="rect-4"></div>
                    <div class="rect-5"></div>
                </div>
                <!-- <img src="/static/ChangeArrow.svg" id="dynamicArrow" class="change-arrow" alt="Change Arrow" /> -->
                <div class="normal-range-text">(${value2.rh.twentyfifth_percentile} - ${value2.rh.seventyfifth_percentile})</div>
            </div>
        </div>
    </div>
    `;
    return row;
}

addRows();