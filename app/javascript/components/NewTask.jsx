import React, { useEffect, useState } from "react";
import axios from "axios";
import APIRoutes from "../utilities/routes";

function NewTask(props) {
  // State to store user input for creating new task
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    tagID: -1,
  });

  // Updates tagID to id of 'All' tag once allID changes
  useEffect(() => {
    setTaskData((prev) => ({
      ...prev,
      tagID: props.allID,
    }));
  }, [props.allID]);

  // Updates state when user edits input
  const handleChange = (event) => {
    setTaskData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // Calls API to create new task
  const handleSubmit = (event) => {
    const { title, description, tagID } = taskData;

    // Check if the selected tag is "To Do"
    if (tagID === YOUR_TODO_TAG_ID) {
      // Fetch the total tasks and "To Do" tasks
      axios.get(APIRoutes.url + "/tasks/all", { withCredentials: true })
        .then((response) => {
          const totalTasks = response.data.length;
          const todoTasks = response.data.filter((task) => task.tag_id === YOUR_TODO_TAG_ID).length;

          // Check if adding a new "To Do" task would exceed 50% of total tasks
          if ((todoTasks + 1) / totalTasks <= 0.5) {
            // Proceed with creating the task
            axios.post(
              APIRoutes.url + "/tasks",
              {
                task: {
                  title: title,
                  description: description,
                  tag_id: tagID,
                },
              },
              { withCredentials: true }
            )
            .then((response) => {
              setTaskData({
                title: "",
                description: "",
                tagID: props.allID,
              });
              props.getTasks();
            })
            .catch((error) => {
              console.log(error);
            });
          } else {
            // Show an error message or handle the case where the limit is reached
            alert("Cannot add more 'To Do' tasks as it would exceed 50% of total tasks.");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // Proceed with creating the task for other tags
      axios.post(
        APIRoutes.url + "/tasks",
        {
          task: {
            title: title,
            description: description,
            tag_id: tagID,
          },
        },
        { withCredentials: true }
      )
      .then((response) => {
        setTaskData({
          title: "",
          description: "",
          tagID: props.allID,
        });
        props.getTasks();
      })
      .catch((error) => {
        console.log(error);
      });
    }

    event.preventDefault();
  };
  return (
    <div
      className="modal fade"
      id="newTask"
      tabIndex="-1"
      aria-labelledby="newTaskModal"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content modal-main">
          <form onSubmit={handleSubmit}>
            <div className="modal-body d-flex flex-column">
              <input
                name="title"
                placeholder="Task title"
                className="form-control task-input py-2 my-2"
                value={taskData.title}
                onChange={handleChange}
                required
              ></input>
              <select
                name="tagID"
                className="form-control task-input py-2 my-2"
                value={taskData.tagID}
                onChange={handleChange}
              >
                <option value={props.allID}>All</option>
                {props.tagsData &&
                  props.tagsData.map((tag, key) => {
                    return (
                      <option key={key} value={tag.id}>
                        {tag.title}
                      </option>
                    );
                  })}
              </select>
              <textarea
                name="description"
                placeholder="Note"
                className="form-control task-input py-2 my-2"
                value={taskData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  // }
}

export default NewTask;
