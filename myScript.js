let stopSorting = false;

function generateRandomArray(size, min, max) {
    let array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return array;
}

function updateArrayView(array) {
    let arrayContainer = document.getElementById("arraycontainer");
    arrayContainer.innerHTML = "";
    for (const value of array) {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = value + "px";
        arrayContainer.appendChild(bar);
    }
    console.log(array)
}

async function bubbleSort(array) {
    const n = array.length;
    let swapped;

    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            if (array[i] > array[i + 1]) {
                if (stopSorting) {
                    return; 
                }
                // let temp=array[i+1];
                // array[i+1]=array[i]
                // array[i]=temp
                [array[i], array[i + 1]] = [array[i + 1], array[i]];
                swapped = true;
                updateArrayView(array);
                await sleep(100-speed.value); 
            }
        }
    } while (swapped);
}

async function quickSort(array, low, high) {
    if (low < high) {
        const pivotIndex = await partition(array, low, high);
        await quickSort(array, low, pivotIndex - 1);
        await quickSort(array, pivotIndex + 1, high);
    }
}

async function partition(array, low, high) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            updateArrayView(array);
            await sleep(50); 
        }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    updateArrayView(array);
    await sleep(100-speed.value);

    return i + 1;
}

async function mergeSort(array) {
    if (array.length <= 1) {
        return array;
    }

    const middle = Math.floor(array.length / 2);
    const left = array.slice(0, middle);
    const right = array.slice(middle);

    let leftSorted = await mergeSort(left);
    let rightSorted = await mergeSort(right);

    return merge(leftSorted, rightSorted);
}

async function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;         
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex), right.slice(rightIndex));
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


document.getElementById("arraygenerate").addEventListener("click", () => {
    const array = generateRandomArray(50, 10, 100); 
    updateArrayView(array);
});

document.getElementById("start-sort").addEventListener("click", async () => {
    stopSorting = false;
    const algorithmSelect = document.getElementById("algorithmselection");
    const selectedAlgorithm = algorithmSelect.value;

    let array = Array.from(document.getElementsByClassName("bar")).map(bar => parseInt(bar.style.height, 10));

    if (selectedAlgorithm === "bubble") {
        await bubbleSort(array);
    } else if (selectedAlgorithm === "quick") {
        await quickSort(array, 0, array.length - 1);
    } else if (selectedAlgorithm === "merge") {
        array =  await mergeSort(array);
        updateArrayView(array);
    }

    updateArrayView(array);
});

document.getElementById("stop-sort").addEventListener("click", () => {
    stopSorting = true; 
});

document.getElementById("speed").addEventListener("input", () => {
    const speed = document.getElementById("speed").value;
});

console.log(speed.value)