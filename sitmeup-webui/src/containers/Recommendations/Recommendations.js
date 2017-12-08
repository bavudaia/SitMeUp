import React, { Component } from 'react';
import {
    Row, Col, Card, CardHeader, CardBody, CardBlock, CardImg, CardTitle
} from "reactstrap";

import { getInsights } from '../../utils/apiCalls.js';

class Recommendations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            insightsData: [],
        };
        console.log("All Props:" + JSON.stringify(this.props));
        this.user = this.props.appUser;
        this.userid = this.props.data.userID;
        this.getChartsInfo = this.getChartsInfo.bind(this);
    }

    getChartsInfo() {
        getInsights((this.userid).toString()).then((data) => {
            this.setState({ insightsData: data.Recommendations_List });
        });
    }

    componentDidMount() {
        this.getChartsInfo();
    }

    render() {

        return (
            <div className="fadeIn pt-3" >
                <Card className="p-3 card-accent-info border-info">
                    <Row className="p-3">
                        <Col xs="12">
                            <CardTitle>Recommended Postures</CardTitle>
                        </Col>
                    </Row>

                    <Row>
                        {this.state.insightsData.map((record, i) =>
                            (<Col xs="6" md="2" key={i + "col"}>
                                <Card key={i + "card"}>
                                    <CardImg key={i + "img"} top width="100%" height="150px" src={'/img/' + record + '.png'} alt="Posture Image" />
                                </Card>
                            </Col>)
                        )}

                    </Row>
                </Card>
            </div>
        )
    }
}

export default Recommendations;
