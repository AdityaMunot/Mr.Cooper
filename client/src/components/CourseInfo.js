import React , { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import deepPurple from '@material-ui/core/colors/deepPurple';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import green from '@material-ui/core/colors/green';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import CoursePanel from './CoursePanel';
import MyProfile from './MyProfile';
import { getCoursesFromOffset } from '../actions/index';

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  toolbarMain: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
  },
  appbar: {
    backgroundColor: '#FFF7E4',
    borderBottom: `solid 3px #998643`
  },
  mainGrid: {
    marginTop: theme.spacing.unit * 0,
  },
  footer: {
    marginTop: theme.spacing.unit * 1,
    padding: `${theme.spacing.unit * 6}px 0`,
  },
  link: {
    underline: 'none',
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepPurple[500],
  },
});

const apiserver = 'http://localhost:3200';
const sections = [
  {link: '/grid', label: 'Scheduling'},
  {link: '/courses', label: 'Profile'},
  {link: '/explore', label: 'Explore Course'},
  {link: '/grid', label: 'Opinion'},
  {link: '/grid', label: 'About'},
];



class CourseInfo extends Component  {

    constructor(props) {
      super(props);
      this.state = { course_name: '', commentlist:[], instructorlist:[]};
    }

    componentDidMount() {
      const { course_name } = this.props.match.params;
      this.setState({course_name:course_name});
      const data = {
        course_name : course_name,
      };

      fetch(apiserver + '/getCommentlist/', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
      })
      .then(response => response.json())
      .then(total =>{
        this.setState({commentlist:total});
        fetch(apiserver + '/getInstructorlist/', {
          method: "POST",
          body: JSON.stringify(data),
          headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(result => this.setState({instructorlist:result}))
      })
    }

    render () {
      const { classes } = this.props;
      console.log(this.state.commentlist);
      const student_name = sessionStorage.getItem('student_name');
      const matches = student_name.match(/\b(\w)/g);
      const avatar_title = matches.join('');

      console.log('My courses rendered.');

      return(
              <React.Fragment key={'course'}>
                <CssBaseline />
                <div className={classes.layout}>
                  <Toolbar className={classes.toolbarMain}>
                    <Grid container justify="center" alignItems="center">
                      <Typography
                        variant="h2"
                        component="h4"
                        color="inherit"
                        align="center"
                        noWrap
                        className={classes.toolbarTitle}
                      >
                        My University
                      </Typography>
                      <Typography
                        component="h4"
                        color="inherit"
                        align="right"
                        noWrap
                        className={classes.toolbarTitle}
                      >
                        Welcome {student_name} !
                      </Typography>
                      <Avatar className={classes.purpleAvatar}>{avatar_title}</Avatar>
                    </Grid>
                  </Toolbar>
                  <AppBar className={classes.appbar} position='static'>
                      <Toolbar variant="dense" className={classes.toolbarSecondary}>
                          {sections.map(section => (
                            <Link href={section.link} key={section.label} underline={'none'} color={'textSecondary'}> {section.label} </Link>
                          ))}
                      </Toolbar>
                  </AppBar>
                  <main>
                    <Grid container spacing={24} className={classes.mainGrid}>
                      <Grid item xs={12} md={12}>
                        <Typography variant="h4" gutterBottom>
                          {this.state.course_name + "'s  comments"}
                        </Typography>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={12}>
                      <List component="nav" className={classes.root}>

                      {this.state.commentlist.map(comment => (
                        <React.Fragment key = {comment.comment}>
                          <ListItem button divider>
                            <ListItemText primary={comment.comment} />
                          </ListItem>
                          <Divider/>
                        </React.Fragment>
                      ))}
                      </List>
                      <Typography variant="h4" gutterBottom>
                        professors
                      </Typography>
                      <List component="nav" className={classes.root}>

                      {this.state.instructorlist.map(instructor => (
                        <React.Fragment key = {instructor.Instructor}>
                          <Typography variant="h4" gutterBottom>
                            {instructor.Instructor}
                          </Typography>
                          <Grid item xs={6}>
                            clear: <Progress className={classes.prog} percent={instructor.rating > 0 ? Math.floor(100*instructor.clear/instructor.rating) : 0}/>
                            engaging: <Progress className={classes.prog} percent={instructor.rating > 0 ? Math.floor(100*instructor.engaging/instructor.rating) : 0}/>
                             {instructor.rating > 0 ? instructor.rating : 0}ratings
                          </Grid>
                          <Divider/>
                        </React.Fragment>
                      ))}
                      </List>

                      </Grid>
                    </Grid>
                  </main>
                </div>
                {/* Footer */}
                <footer className={classes.footer}>
                  <Typography variant="h6" align="center" gutterBottom>
                    Welcome to My University
                  </Typography>
                </footer>
                {/* End footer */}
              </React.Fragment>
        );
    }

}

CourseInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CourseInfo);
