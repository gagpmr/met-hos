import $ from "jquery";
import React from "react";
import PropTypes from "prop-types";
import { gql, graphql } from "react-apollo";
import * as Styles from "/imports/modules/styles.js";

const enableInput = e => {
  if (e === undefined) {
    return false;
  }
  e.preventDefault();
  $("#return-amount")
    .prop("disabled", "")
    .select();
  return true;
};

const RESIDENT_DETAILS = gql`
  query($id: String!) {
    residentDetails(id: $id)
  }
`;

const submit = (props, e) => {
  e.preventDefault();
  props.mutate({
    variables: {
      id: props.resident._id,
      returnAmount: parseInt($("#return-amount").val(), 10)
    },
    refetchQueries: [
      {
        query: RESIDENT_DETAILS,
        variables: { id: props.resident._id }
      }
    ]
  });
  $("#return-amount").prop("disabled", "disabled");
};

const keyPressed = (props, e) => {
  if (e.key === "Enter") {
    submit(props, e);
  }
};

const EditReturnAmount = props => {
  const resident = props.resident;
  return (
    <span>
      <input
        onKeyDown={e => keyPressed(props, e)}
        autoFocus
        type="text"
        tabIndex="1"
        id="return-amount"
        data-resid={resident._id}
        style={{ width: 37, textAlign: "center", border: 0, height: 20 }}
        defaultValue={resident.ReturnAmount}
        disabled="disabled"
      />
      &nbsp;
      <a
        href=""
        onClick={e => enableInput(e)}
        style={Styles.PaddingThreeCenterLargeBold}
      >
        <i className="fa fa-pencil-square-o" />
      </a>
    </span>
  );
};

EditReturnAmount.propTypes = {
  resident: PropTypes.object
};

const EDIT_RETURN_AMOUNT = gql`
  mutation($id: String!, $returnAmount: Int!) {
    editReturnAmount(id: $id, returnAmount: $returnAmount)
  }
`;

export default graphql(EDIT_RETURN_AMOUNT)(EditReturnAmount);
