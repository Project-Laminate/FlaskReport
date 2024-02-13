
let paddingCnt = 44;
function addRows() {

let report = {
    csvData: reportData
}
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
}
}

function calculatePosition(reading, mean, std) {
    // Define new boundaries based on standard deviations from the mean
    const boundaries = [
        mean - 4*std, 
        mean - 3*std, 
        mean - 2*std, 
        mean + 2*std, 
        mean + 3*std, 
        mean + 4*std
    ];
    const pixelWidths = [13, 26, 91, 26, 13];
    let position = 0;
    let accumulatedWidth = 0;

    // Find the index for the percentile range
    const index = boundaries.findIndex((value) => reading <= value) - 1;

    // Calculate the width covered by the previous segments
    for (let i = 0; i < index; i++) {
        accumulatedWidth += pixelWidths[i];
    }

    // Calculate the position within the current segment
    if (index >= 0) {
        const segmentStartPercentile = boundaries[index];
        // console.log(segmentStartPercentile)
        const segmentEndPercentile = boundaries[index + 1];
        // console.log(segmentEndPercentile)
        const segmentWidth = pixelWidths[index];
        // console.log(segmentWidth)

        // Calculate the percentage of the way through the current segment
        const segmentPercent = (reading - segmentStartPercentile) / (segmentEndPercentile - segmentStartPercentile);
        // console.log(segmentPercent)
        // Convert that to a pixel value and add it to the accumulated width
        position = accumulatedWidth + (segmentPercent * segmentWidth);
        // console.log(position)
    } else {
        // If the reading is less than the first boundary, it's in the first segment
        position = (reading / boundaries[1]) * pixelWidths[0];
    }

    return position;
}
function newRow(padding, key, value) {
    let row = document.createElement("div");
    row.innerHTML = `
    <div class="row">
        <b class="display-label" style="top:${padding + 25}px !important;">${value.display}</b>
        <div class="lh-tile" style="top:${padding}px !important;">
            <div class="reading">${value.lh.reading} ${value.lh.unit}</div>
            <div class="percentile-value">${value.lh.percentile}<sup><sup>th</sup></sup>  percentile</div>
            <div class="percentile-box">
            <div class="percentile-box-child"></div>
            <div class="percentile-box-item"></div>
            <div class="percentile-box-inner"></div>
            <div class="rectangle-div"></div>
            <div class="percentile-box-child1"></div>
            </div>
            <div class="div1">(${value.lh.min} - ${value.lh.max})</div>
            <b class="b" style="position: absolute; left: ${calculatePosition(value.lh.reading, value.lh.mean, value.lh.std)}px; bottom: -10px; transform: translateX(23%);">◆</b>
        </div>
        <div class="rh-tile" style="top:${padding}px !important;">
            <div class="reading">${value.rh.reading} ${value.rh.unit}</div>
            <div class="percentile-value">${value.rh.percentile}<sup><sup>th</sup></sup>  percentile</div>
            <div class="percentile-box">
            <div class="percentile-box-child"></div>
            <div class="percentile-box-item"></div>
            <div class="percentile-box-inner"></div>
            <div class="rectangle-div"></div>
            <div class="percentile-box-child1"></div>
            </div>
            <div class="div1">(${value.rh.min} - ${value.rh.max})</div>
            <b class="b" style="position: absolute; left: ${calculatePosition(value.rh.reading, value.rh.mean, value.rh.std)}px; bottom: -10px; transform: translateX(23%);">◆</b>
        </div>
    </div>
    `;
    return row;
}
addRows();