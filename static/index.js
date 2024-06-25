
let paddingCnt = 44;
function addRows() {

    let report = {
        csvData: reportData
    }

    // remove age and sex from the data
    delete report.csvData.age;
    delete report.csvData.sex;

    // Convert object into an array of objects with key and priority
    let dataArray = Object.keys(report.csvData).map(key => {
        return {
            key: key,
            value: report.csvData[key],
            priority: report.csvData[key].priority // Use the 'priority' property
        };
    });

    // Sort the array by priority
    dataArray.sort((a, b) => a.priority - b.priority);

    // Loop through the sorted array and add rows using keys and values
    for (let item of dataArray) {
        document.getElementById("table").appendChild(newRow(paddingCnt, item.key, item.value));
        paddingCnt += 84; // Increment padding for the next row
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
function newRow(padding, key, value) {
    let row = document.createElement("div");
    row.innerHTML = `
    <div class="row" style="padding-top: 3px;">
        <b class="display-label"">${value.display}</b>
        <div class="container">
            <div class="row">
                <span class="measure-text">3135.7</span>
                <img src="/static/Arrow1grey.svg" alt="Arrow" width="36" />
                <span class="measure-subtext">+10%</span>
                <span class="measure-text">3295.5</span>
            </div>
            <div class="row">
                <span class="measure-text">45.5 <sup>pct</sup></span>
                <span class="measure-subtext">+17 <sup>pct</sup></span>
                <img src="/static/Arrow1grey.svg" alt="Arrow" width="36" />
                <span class="measure-text">57.5 <sup>pct</sup></span>
            </div>
            <div class="percentile-box">
                <div class="bar">
                    <div class="rect-1"></div>
                    <div class="rect-2"></div>
                    <div class="rect-3"></div>
                    <div class="rect-4"></div>
                    <div class="rect-5"></div>
                </div>
                <img src="/static/ChangeArrow.svg" id="dynamicArrow" class="change-arrow" alt="Change Arrow" />
                <div class="normal-range-text">(2500.5 - 4500.5)</div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <span class="measure-text">3135.7</span>
                <img src="/static/Arrow1grey.svg" alt="Arrow" width="36" />
                <span class="measure-subtext">+10%</span>
                <span class="measure-text">3295.5</span>
            </div>
            <div class="row">
                <span class="measure-text">45.5 <sup>pct</sup></span>
                <span class="measure-subtext">+17 <sup>pct</sup></span>
                <img src="/static/Arrow1grey.svg" alt="Arrow" width="36" />
                <span class="measure-text">57.5 <sup>pct</sup></span>
            </div>
            <div class="percentile-box">
                <div class="bar">
                    <div class="rect-1"></div>
                    <div class="rect-2"></div>
                    <div class="rect-3">
                    </div>
                    <div class="rect-4"></div>
                    <div class="rect-5"></div>
                </div>
                <img src="/static/ChangeArrow.svg" id="dynamicArrow" class="change-arrow" alt="Change Arrow" />
                <div class="normal-range-text">(2500.5 - 4500.5)</div>
            </div>
        </div>
    </div>
    `;
    return row;
}
addRows();