import React from 'react';
import PropTypes from 'prop-types';
import {promiseAllObject} from 'core/utils';
import ng from 'core/services/ng';

interface IPropsReactRenderAsync {
    promises: any;
    originalProps: any;
    component: React.ComponentType;
}

interface IStateReactRenderAsync {
    loading: boolean;
    mappedProps: any;
}

class ReactRenderAsync extends React.Component<IPropsReactRenderAsync, IStateReactRenderAsync> {
    static propTypes: any;
    static defaultProps: any;

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            mappedProps: {},
        };
    }
    componentDidMount() {
        promiseAllObject(this.props.promises)
            .then((result) => {
                this.setState({
                    loading: false,
                    mappedProps: result,
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }
    render() {
        const Component = this.props.component;

        return this.state.loading === true
            ? null
            : <Component {...{...this.props.originalProps, ...this.state.mappedProps}} />
        ;
    }
}

ReactRenderAsync.propTypes = {
    promises: PropTypes.object,
    component: PropTypes.func,
    originalProps: PropTypes.object,
};

/* eslint-disable react/no-multi-comp */
export function connectPromiseResults<T>(getPromises) {
    return function(component): React.ComponentType<T> {
        return function connectPromiseComponent(props) {
            return (
                <ReactRenderAsync
                    promises={getPromises(props)}
                    component={component}
                    originalProps={props}
                />
            );
        };
    };
}

export function connectServices<T>(component: React.ComponentType<T>, services) {
    return connectPromiseResults<T>(() => {
        const promisesObject = {};

        services.forEach((serviceName) => {
            promisesObject[serviceName] = ng.getService(serviceName);
        });

        return promisesObject;
    })(component);
}
