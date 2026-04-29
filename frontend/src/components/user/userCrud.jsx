import react, {Component} from 'react';
import Main from '../templates/Main';
import axios from 'axios';

const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de usuários: Incluir, Listas, Alterar e Excluir!'
}

const baseUrl = process.env.REACT_APP_API_URL;
axios.defaults.baseURL = baseUrl;
const initialState = {
    user: {name: '', email: ''},
    list: []
}

export default class UserCrud extends Component {

    state = {...initialState}

    componentWillMount() {
        axios(baseUrl).then(resp => {
            console.log("Dados recebidos:", resp.data);
            this.setState({list: Array.isArray(resp.data) ? resp.data : []});
        }).catch(error => {
            console.error('Erro ao buscar usuário: ',error);
        });
    };

    clear() {
        this.setState({user: initialState.user});
    };

    save() {
        const user = this.state.user;
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/api/users/${user.id}` : `${baseUrl}/api/users`;
        
        axios[method](url, user)
            .then(resp => {
                console.log('Resposta após salvar o usuário:', resp.data);
                const newUser = resp.data;
                const list = this.getUpdatedList(newUser);
                this.setState({user: initialState.user, list});
            })
            .catch(error => {
                console.error('Erro ao salvar usuário', error);
            });
    };

    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id);
        if(add) list.unshift(user);
        return list;
    };

    updateField(event) {
        const user = {...this.state.user};
        user[event.target.name] = event.target.value;
        this.setState({user});
    };

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control" 
                                name='name' 
                                value={this.state.user.name}
                                onChange={e => this.updateField(e)}
                                placeholder='Digite o nome....'/>
                        </div>
                    </div>
                
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" className="form-control" 
                                name='email'
                                value={this.state.user.email}
                                onChange={e => this.updateField(e)}
                                placeholder='Digite o e-mail...'/>
                        </div>
                    </div>
                </div>

                <hr/>
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(user) {
        this.setState({user})
    }

    remove(user) {
        axios.delete(`${baseUrl}/api/users/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({list})
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(user =>{
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="btn btn-warning mt-1 ml-1"
                            onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-warning mt-1 ml-1"
                            onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}
