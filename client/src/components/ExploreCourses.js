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

import green from '@material-ui/core/colors/green';

import CoursePanel from './CoursePanel';
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
  mainFeaturedPost: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing.unit * 4,
  },
  mainGrid: {
    marginTop: theme.spacing.unit * 0,
  },
  footer: {
    marginTop: theme.spacing.unit * 1,
    padding: `${theme.spacing.unit * 6}px 0`,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  fabProgress: {
    color: green[500],
    position: 'relative',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
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

const sections = [
  {link: '/grid', label: 'Scheduling'},
  {link: '/courses', label: 'Profile'},
  {link: '/explore', label: 'Explore Course'},
  {link: '/grid', label: 'Opinion'},
  {link: '/grid', label: 'About'},
];

function mapDispatchToProps(dispatch) {
  return {
    getCoursesFromOffset: offset => dispatch(getCoursesFromOffset(offset))
  };
}

const mapStateToProps = state => {

  return { courses: state.ajaxCourses };

};

class ConnectedExploreCourses extends Component  {

    constructor(props) {
      super(props);
      this.state = { courses: [], total: 0, offset: 0, isLoading: false };
    }

    componentDidMount() {
      fetch('http://localhost:3200/total')
            .then(response => response.json())
            .then(total => this.setState({total: total.total}))

      this.setState({offset: this.state.offset + 10});

      this.props.getCoursesFromOffset(0);

      window.addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount() {
      window.removeEventListener('scroll', this.onScroll, false);
    }

    onScroll = () => {
      console.log(this.state.isLoading);
      if (this.state.offset < this.state.total) {
        if ( (( window.innerHeight + window.scrollY ) >= (document.body.offsetHeight - 50)) && !this.state.isLoading ) {

                this.setState({isLoading: true});

                this.props.getCoursesFromOffset(this.state.offset);

                this.setState({offset: this.state.offset + 10});

                this.setState({isLoading: false});
        }
      }
    }

    render () {
      const { classes } = this.props;

      const student_name = sessionStorage.getItem('student_name');
      const matches = student_name.match(/\b(\w)/g);
      const avatar_title = matches.join('');

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
                          Courses
                        </Typography>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <CoursePanel courses={this.props.courses}/>
                      </Grid>
                      <Grid container justify="center">
                        {<CircularProgress size={36} className={classes.buttonProgress} />}
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

ConnectedExploreCourses.propTypes = {
  classes: PropTypes.object.isRequired,
};

const ExploreCourses = connect(mapStateToProps, mapDispatchToProps)(ConnectedExploreCourses);

export default withStyles(styles)(ExploreCourses);
