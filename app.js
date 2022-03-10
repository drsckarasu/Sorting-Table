const appRoot = document.getElementById('app-root');

let selectedCategoryType = '';
let tableRows = [];
let table = document.createElement('table');
let tableBody = document.createElement('tbody');
const ONE = 1;

appRoot.insertAdjacentHTML(
    'afterbegin',
	`<h1>Countries Search</h1>
    <form>
        <div class='inputs'>
            <p>Please choose the type of search:</p>
            <div id='radioBtns'>
                <label for='region'>
                    <input type='radio' name='getList' id='region' class='radio'>
                    By Region
                </label>
                 <label for='language'>
                    <input type='radio' name='getList' id='language' class='radio'>
                    By Language
                </label>
            </div>
        </div>
        <div class='inputs' id='inputSelect'>
            <label for='selectValues'>
                Please choose search query:
                <select id='selectValues' disabled>
                    <option id='selectOption'>Select value</option>
                </select>
            </label>
        </div>
    </form>
    <p id='mainText' class='hidden'>No items, please choosen search query</p>`
);
let radio = document.querySelectorAll('input[name="getList"]');
let radioRegion = document.getElementById('region');
let radioLanguage = document.getElementById('language');
let select = document.getElementById('selectValues');
let optionSelect = document.getElementById('selectOption');
let mainText = document.getElementById('mainText');

for (let i = 0; i < radio.length; i++) {
    radio[i].onclick = function() {
        mainText.classList.remove('hidden');
        table.classList.add('hidden');
        select.disabled = false;
        select.length = 0;
        select.add(optionSelect);
        if (radioRegion === radio[i]) {
            selectedCategoryType = 'region';
            for (let key in externalService.getRegionsList()) {
                if (externalService.getRegionsList()[key]) {
                    option = document.createElement('option');
                    option.value = option.textContent = externalService.getRegionsList()[key];
                    select.add(option);
                }  
            } 
        } else if (radioLanguage === radio[i]) {
            selectedCategoryType = 'language';
            for (let key in externalService.getLanguagesList()) {
                if (externalService.getLanguagesList()[key]) {
                    option = document.createElement('option');
                    option.value = option.textContent = externalService.getLanguagesList()[key];
                    select.add(option);
                }  
            }
        }
    };
}

select.addEventListener('change', () => {
    if (select.value === optionSelect.value) {
        mainText.classList.remove('hidden');
        table.classList.add('hidden');
    } else {
        mainText.classList.add('hidden');
        table.classList.remove('hidden');
        if (selectedCategoryType === 'language') {
            tableRows = externalService.getCountryListByLanguage(select.value);
        } else if (selectedCategoryType === 'region') {
            tableRows = externalService.getCountryListByRegion(select.value);
        }
        table.remove();
        renderTableRows(tableRows);
    }
});

const renderTableRows = (tableRows) => {
    table = document.createElement('table');
    let rowHead = document.createElement('tr');
    rowHead.insertAdjacentHTML(
		'afterbegin',
		`<th>
        Country name <button type='button' id='btnName_up'>&#8593;</button>
        <button type='button' id='btnName_down' class='hidden'>&#8595;</button>
        <button type='button' id='btnName_twoSide' class='hidden'>&#8597;</button>
        </th>
        <th>Capital</th>
        <th>World Region</th>
        <th>Languages</th>
        <th>
        Area <button type='button' id='btnArea_up' class='hidden'>&#8593;</button>
        <button type='button' id='btnArea_down' class='hidden'>&#8595;</button>
        <button type='button' id='btnArea_twoSide'>&#8597;</button>
        </th>
        <th>Flag</th>`
	    );
    table.appendChild(rowHead);
    appRoot.appendChild(table);
    createTableBody(tableRows);
    let btnNameUp = document.getElementById('btnName_up');
    let btnNameDown = document.getElementById('btnName_down');
    let btnNameTwoSide = document.getElementById('btnName_twoSide');
    let btnAreaUp = document.getElementById('btnArea_up');
    let btnAreaDown = document.getElementById('btnArea_down');
    let btnAreaTwoSide = document.getElementById('btnArea_twoSide');
    btnNameUp.addEventListener('click', () => {
        btnNameUp.classList.add('hidden');
        btnNameDown.classList.remove('hidden');
        tableBody.remove();
        sortUpTableName(tableRows);
    });
    btnNameDown.addEventListener('click', () => {
        btnNameDown.classList.add('hidden');
        btnNameUp.classList.remove('hidden');
        tableBody.remove();
        sortDownTableName(tableRows);
    });
    btnNameTwoSide.addEventListener('click', () => {
        btnNameUp.classList.remove('hidden');
        btnAreaUp.classList.add('hidden');
        btnAreaDown.classList.add('hidden');
        btnAreaTwoSide.classList.remove('hidden');
        btnNameTwoSide.classList.add('hidden');
        tableBody.remove();
        sortUpTableName(tableRows);
    });
    btnAreaUp.addEventListener('click', () => {
        btnAreaUp.classList.add('hidden');
        btnAreaDown.classList.remove('hidden');
        tableBody.remove();
        sortUpTableArea(tableRows);
    });
    btnAreaDown.addEventListener('click', () => {
        btnAreaDown.classList.add('hidden');
        btnAreaUp.classList.remove('hidden');
        tableBody.remove();
        sortDownTableArea(tableRows);
    });
    btnAreaTwoSide.addEventListener('click', () => {
        btnAreaUp.classList.remove('hidden');
        btnNameUp.classList.add('hidden');
        btnNameDown.classList.add('hidden');
        btnNameTwoSide.classList.remove('hidden');
        btnAreaTwoSide.classList.add('hidden');
        tableBody.remove();
        sortUpTableArea(tableRows);
    });
};

const sortUpTableName = (arr) => {
    let sortTable = arr.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? ONE : -ONE);
    createTableBody(sortTable);
};

const sortDownTableName = (arr) => {
    let sortTable = arr.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? ONE : -ONE);
    createTableBody(sortTable);
};

const sortUpTableArea = (arr) => {
    let sortTable = arr.sort((a, b) => a.area > b.area ? ONE : -ONE);
    createTableBody(sortTable);
};

const sortDownTableArea = (arr) => {
    let sortTable = arr.sort((a, b) => a.area < b.area ? ONE : -ONE);
    createTableBody(sortTable);
};

const createTableBody = (arr) => {
    tableBody = document.createElement('tbody');
    table.appendChild(tableBody);
    for (let j = 0; j < arr.length; j++) {
        let row = document.createElement('tr');
        row.insertAdjacentHTML(
		'beforeend',
		`<td>${arr[j].name}</td>
        <td>${arr[j].capital}</td>
        <td>${arr[j].region}</td>
        <td>${Object.values(arr[j].languages).join(', ')}</td>
        <td>${arr[j].area}</td>
        <td><img src=${arr[j].flagURL}></td>`
	    )
        tableBody.appendChild(row);
    }
};