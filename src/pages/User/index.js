import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';

import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
    refreshing: false,
  };

  async componentDidMount() {
    const {page} = this.state;
    const {navigation} = this.props;
    const user = navigation.getParam('user');

    this.setState({
      loading: true,
    });

    try {
      const response = await this.getStarred(user, page);
      this.setState({
        stars: response.data,
      });
    } catch (err) {
      console.tron.log('Ocorreu um erro ao tentar buscar os favoritos.', err);
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  getStarred = async (user, page) => {
    return await api.get(`/users/${user.login}/starred?page=${page}`);
  };

  loadMore = async () => {
    const {navigation} = this.props;
    const user = navigation.getParam('user');
    const {page, stars} = this.state;

    try {
      const newPage = page + 1;
      const response = await this.getStarred(user, newPage);
      this.setState({
        stars: stars.concat(response.data),
      });
    } catch (err) {
      console.tron.log(err);
    }
  };

  refreshList = async () => {
    const {navigation} = this.props;
    const user = navigation.getParam('user');

    this.setState({refreshing: true});

    try {
      const response = await this.getStarred(user, 1);
      this.setState({
        stars: stars.concat(response.data),
      });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({refreshing: false});
    }
  };

  handleNavigate = repository => {
    const {navigation} = this.props;

    navigation.navigate('Repository', {repository});
  };

  render() {
    const {navigation} = this.props;
    const {stars, loading, refreshing} = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar_url}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <ActivityIndicator color="#d3d3d3" />
        ) : (
          <Stars
            onRefresh={this.refreshList}
            refreshing={refreshing}
            onEndReachedThreshold={0.2} //Carrega mais itens quando chegar em 20% do fim da lista
            onEndReached={this.loadMore} // Executa quando chega no limite da lista
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({item}) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
