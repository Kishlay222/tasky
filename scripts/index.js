// console.log('hello world')
const state = {
    taskList: [],
};

//Document
const taskCont = document.querySelector(".task_contents");
const taskModal = document.querySelector(".task_modal_body");

const htmlTaskCont = ({
    id,
    title,
    description,
    url,
    type
}) => `
    <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
        <div class='card shadow-sm task_card'>
            <div class='card-header d-flex gap-2 justify-content-end task_card_header'>
                <button type='button' class='btn btn-outline-info mr-2' name=${id}>
                    <i class='fas fa-pencil-alt'name=${id}> </i>
                </button>
                <button type='button' class='btn btn-outline-danger mr-2' name=${id}>
                    <i class='fas fa-trash-alt' name=${id}></i>
                </button>
            </div>
            <div class='card-body'>
                ${
                  url &&
                  `
                  <img src=${url} alt='card image' class='card-img-top mr-2 rounded-lg'/>
                  `
                }
                <h4 class='task_card_title'>${title}</h4>
                <p class='description trim-3-lines text muted'>${description}</p>
                <div class='tags d-flex'><span class='badge bg-primary m-1'>${type}</span></div>
                
        </div>
        <div class='card-footer'>
            <button class="btn btn-outline-primary" type="button" data-bs-toggle="modal" data-bs-target="#showTask" id=${id} onclick='openTask.apply(this, arguments)' >
            Open Task 
            </button>
        </div>
    </div>
    `;

//lead make it our own 
//text muted makes text light in colour
const htmlTaskModal = ({
    id,
    title,
    description,
    url,
}) => {
    const date = new data(parseInt(id));
    return `
    <div id=${id}>
    ${
        url &&
        `
        <img src=${url} alt='card image' class='img-fluid place__holder__image mb-3'/>
        `
      }
      <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>
      
      <h2 class='my-3'>${title}</h2>
      <p class='lead'>
      ${description}
      </p>
    </div>
    `
};

const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify({
        tasks: state.taskList,
    }));
};
//localStorage is an obj
//local storage saves data(only str) even after reload
//we need to update every time when we use 'add item'
//setItem takes key,value pair ... tasks & .stringify converts obj/arr into str
//every time data sores in state-->taskList

//now to get the saved data from localStorge
const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.tasks); //converting back to str using parse
    //if no data present at start... so localstoragecopy is empty 
    //when localstroagecopy is nt empty we need to add it in task
    if (localStorageCopy) state.taskList = localStorageCopy.tasks;
    //when we have data 
    state.taskList.map((cardData) => {
        taskCont.insertAdjacentHTML('beforeend', htmlTaskCont(cardData));
    });
    //insertAdjacenthtml-- inside taskcont we need to add html
    //beforeend --- means inside taskcont-->1 div-->
};

const handleSubmit = (event) => {
    const id = `${Date.now}`; //for every task we generate an id for it
    //select input byId selector with id names
    const input = {
        url: document.getElementById('imageurl').value,
        title: document.getElementById('tasktitle').value,
        type: document.getElementById('tags').value,
        description: document.getElementById('taskdescription').value,
    };
    //for not showing empty task modals on clicking save changes
    if (input.title === "" || input.type === "" || input.description === "") {
        return alert("Please fill the required fiels!");
    }

    taskCont.insertAdjacentHTML('beforeend', htmlTaskCont({ //overall obj=input+id
        ...input, //spread input field 
        id, // add id with input field 
    }));
    // to add all these into taskList
    state.taskList.push({
        ...input,
        id
    });
    //now updatelocalstorage
    updateLocalStorage();

}; //calls when we click on 'save changes' btn

const openTask = (e) => { //e = event so add event handler in open task btn
    if (!e) window.event;

    const getTask = state.taskList.find(
        ({
            id
        }) => id === e.target.id //go to open task and verify id
    );
    taskModal.innerHTML = htmlTaskModal(getTask);
};