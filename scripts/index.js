// console.log('hello world')
const state = {
  taskList: [],
};

//Document--selecting class  with querySelector
const taskContents = document.querySelector(".task__contents");
//for pop up of open task---individual task
const taskModal = document.querySelector(".task__modal__body");

const htmlTaskContent = ({ id, title, description, url, type }) => `
    <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
        <div class='card shadow-sm task__card'>
            <div class='card-header d-flex gap-2 justify-content-end task__card__header'>
                <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick="editTask.apply(this,arguments)">
                    <i class='fas fa-pencil-alt' name=${id}> </i>
                </button>
                <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick="deleteTask.apply(this,arguments)">
                    <i class='fas fa-trash-alt' name=${id}></i>
                </button>
            </div>
            <div class='card-body'>
                ${
                  url
                    ? `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
                    : `
              <img width='100%' height='150px' style="object-fit: cover; object-position: center" src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt='card image cap' class='img-fluid place__holder__image mb-3' />
              `
                }
                <h4 class='task__card__title'>${title}</h4>
                <p class='description trim-3-lines text muted'>${description}</p>
                <div class='tags d-flex'><span class='badge bg-primary m-1'>${type}</span></div>
            </div>
            <div class='card-footer'>
                <button class='btn btn-outline-primary float-right' type='button' data-bs-toggle='modal' data-bs-target='#showTask' id=${id} onclick="openTask.apply(this, arguments)" >
                    Open Task 
                </button>
            </div>
        </div>
    </div>
    `; //cant use this in arrow fn
//to use ---  .apply(this, )

//lead make it our own
//text muted makes text light in colour
const htmlModalContent = ({ id, title, description, url }) => {
  const date = new Date(parseInt(id));
  return `
    <div id=${id}>
    ${
      url
        ? `
        <img width='100%' src=${url} alt='card image cap' class='img-fluid place__holder__image mb-3' />
      `
        : `
      <img width='100%' src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt='card image cap' class='img-fluid place__holder__image mb-3' />
      `
    }
      <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>
      <h2 class='my-3'>${title}</h2>
      <p class='lead'>
      ${description}
      </p>
    </div>
    `;
};

const updateLocalStorage = () => {
  localStorage.setItem(
    "tasks",
    JSON.stringify({
      tasks: state.taskList,
    })
  );
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
  state.taskList.map((cardDate) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
  });
  //insertAdjacenthtml-- inside taskContents we need to add html
  //beforeend --- means inside taskContents-->1 div-->
};

const handleSubmit = (event) => {
  const id = `${Date.now()}`; //for every task we generate an id for it
  //select input byId selector with id names
  const input = {
    url: document.getElementById("imageUrl").value,
    title: document.getElementById("taskTitle").value,
    type: document.getElementById("tags").value,
    description: document.getElementById("taskDescription").value,
  };
  //for not showing empty task modals on clicking save changes
  if (input.title === "" || input.type === "" || input.description === "") {
    return alert("Please fill the required fiels!");
  }

  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlTaskContent({
      //overall obj=input+id
      ...input, //spread input field
      id, // add id with input field
    })
  );
  // to add all these into taskList
  state.taskList.push({
    ...input,
    id,
  });
  //now updatelocalstorage
  updateLocalStorage();
}; //calls when we click on 'save changes' btn

const openTask = (e) => {
  //e = event so add event handler in open task btn
  if (!e) e = window.event;

  const getTask = state.taskList.find(
    ({ id }) => id === e.target.id //go to open task and verify id
  );
  taskModal.innerHTML = htmlModalContent(getTask);
};

const deleteTask = (e) => {
  //e = event so add event handler in open task btn
  if (!e) e = window.event;
  //get id,type for selected icon
  const targetId = e.target.getAttribute("name");
  const type = e.target.tagName; //either btn or i bcuz btn has icon inside it
  //new list without the selected icon card id
  const removeTask = state.taskList.filter(({ id }) => id !== targetId);
  state.taskList = removeTask;

  updateLocalStorage();

  if (type === "BUTTON") {
    //target whole div
    //move 3 steps back to parent div as of .js file
    //and 1 move step back of .html file as all js file is in 1 div of .html
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  } //else
  //the icon which is inside btn
  //so,1 step further inside than btn
  return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
  );
};

const editTask = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.id;
  const type = e.target.tagName;

  let parentNode;
  let taskTitle;
  let taskDescription;
  let taskType;
  let submitButton;

  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentNode.childNodes[3].childNodes[3]; //check in console
  //console.log(taskTitle);
  taskDescription = parentNode.childNodes[3].childNodes[5];
  //console.log(taskDescription);
  taskType = parentNode.childNodes[3].childNodes[7].childNodes[0];
  //video lec it was .chil[1]
  //console.log(taskType);
  //inside span
  //open task btn replaced by submit btn
  //childNodes[5] --- card footer
  submitButton = parentNode.childNodes[5].childNodes[1];
  console.log(submitButton);

  //to edit the task
  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");

  submitButton.setAttribute("onclick", "saveEdit.apply(this,arguments)");
  //now change open task to save changes
  //as now save changes does pop out details
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
  //console.log(submitButton);
};

const saveEdit = (e) => {
  if (!e) e = window.event;

  const targetID = e.target.id;
  const parentNode = e.target.parentNode.parentNode;
  // console.log(parentNode.childNodes);

  const taskTitle = parentNode.childNodes[3].childNodes[3];
  const taskDescription = parentNode.childNodes[3].childNodes[5];
  // const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  const taskType = parentNode.childNodes[3].childNodes[7].childNodes[0];
  const submitButton = parentNode.childNodes[5].childNodes[1];

  const updateData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };

  let stateCopy = state.taskList;

  stateCopy = stateCopy.map((task) =>
    task.id === targetID
      ? {
          id: task.id,
          title: updateData.taskTitle,
          description: updateData.taskDescription,
          type: updateData.taskType,
          url: task.url,
        }
      : task
  );

  state.taskList = stateCopy;
  updateLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  //get back to original state of open task
  submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showTask");
  submitButton.innerHTML = "Open Task";
};

const searchTask = (e) => {
  if (!e) e = window.event;

  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }

  const resultData = state.taskList.filter(({ title }) => {
    return title.toLowerCase().includes(e.target.value.toLowerCase());
  });

  console.log(resultData);

  resultData.map((cardData) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
  });
};
