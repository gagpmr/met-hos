import { Col, Grid, Pagination, Row } from "react-bootstrap";
import { gql, graphql } from "react-apollo";

import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import { Middle } from "../../../modules/styles";
import { PropTypes } from "prop-types";
import React from "react";

class Rooms extends React.Component {
  constructor() {
    super();
    this.state = {
      activePage: 1,
      range: 60
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.roomsFiltered = this.roomsFiltered.bind(this);
    this.pagesNo = this.pagesNo.bind(this);
    this.render = this.render.bind(this);
  }

  handleSelect(eventKey) {
    this.setState({ activePage: eventKey });
  }

  roomsFiltered(rooms) {
    const output = [];
    if (rooms.length > 0) {
      for (let index = 0; index < rooms.length; index += 1) {
        const element = rooms[index];
        const test = `${this.state.activePage}/`;
        if (element.Value.includes(test)) {
          output.push(element);
        }
      }
    }
    return output;
  }

  pagesNo(arrayLength) {
    return Math.ceil(arrayLength / this.state.range);
  }

  render() {
    return (
      <Grid fluid>
        <Row className="text-center">
          <Col md={12} style={{ paddingBottom: "30px", paddingTop: "3%" }}>
            <Pagination>
              <Pagination.First />
              <Pagination.Prev />
              <Pagination.Item>{1}</Pagination.Item>
              <Pagination.Ellipsis />

              <Pagination.Item>{10}</Pagination.Item>
              <Pagination.Item>{11}</Pagination.Item>
              <Pagination.Item active>{12}</Pagination.Item>
              <Pagination.Item>{13}</Pagination.Item>
              <Pagination.Item disabled>{14}</Pagination.Item>

              <Pagination.Ellipsis />
              <Pagination.Item>{20}</Pagination.Item>
              <Pagination.Next />
              <Pagination.Last />
            </Pagination>
            ;
          </Col>
          <Col md={12} xs={12} sm={12}>
            {this.roomsFiltered(this.props.rooms).map(room => (
              <Col md={1} sm={2} xs={3} key={room._id} className="h4">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`room-residents/${room._id}`}
                >
                  {room.Value}
                </a>
              </Col>
            ))}
          </Col>
        </Row>
      </Grid>
    );
  }
}

Rooms.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      Value: PropTypes.string.isRequired
    })
  ).isRequired
};

const FormatData = props => {
  if (props.loading) {
    return (
      <div style={Middle}>
        <MDSpinner />
      </div>
    );
  }
  return (
    <Rooms rooms={props.rooms} client={props.client} refetch={props.refetch} />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  rooms: PropTypes.array.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  rooms: []
};

const ROOMS_QUERY = gql`
  query RoomsQuery {
    rooms {
      _id
      Value
    }
  }
`;

export default graphql(ROOMS_QUERY, {
  props: ({ data: { loading, rooms, refetch } }) => ({
    loading,
    rooms,
    refetch
  }),
  forceFetch: true
})(FormatData);
