import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getSelectedEntityType, getSelectedEntityRange} from '../links/entityUtils';
import {Editor, EditorState, RichUtils, getDefaultKeyBinding} from 'draft-js';

/**
 * @ngdoc React
 * @module superdesk.core.editor3
 * @name TableCell
 * @param contentState {Object}
 * @param onChange {Function}
 * @param onFocus {Function}
 * @description Handles a cell in the table, as well as the containing editor.
 */
export class TableCell extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.keyBindingFn = this.keyBindingFn.bind(this);

        this.state = {editorState: props.editorState};
    }

    /**
     * @ngdoc method
     * @name TableCell#keyBindingFn
     * @param {Event} e
     * @description DraftJS key binding function.
     */
    keyBindingFn(e) {
        if (e.ctrlKey && e.key === 'z') {
            return 'parent-undo';
        }

        if (e.ctrlKey && e.key === 'l') {
            return 'toggle-link';
        }

        return getDefaultKeyBinding(e);
    }

    componentWillReceiveProps(nextProps) {
        const {editorState} = this.state;
        const selection = editorState.getSelection();

        if (selection == null || !selection.getHasFocus()) {
            this.setState({
                editorState: nextProps.editorState,
            });
            return;
        }

        const nextEditorState = EditorState.forceSelection(nextProps.editorState, selection);

        this.setState({
            editorState: nextEditorState,
        });
    }

    /**
     * @ngdoc method
     * @name TableCell#handleKeyCommand
     * @param {string} command
     * @description DraftJS key command handler.
     */
    handleKeyCommand(command) {
        const {editorState} = this.state;
        let newState;

        if (command === 'parent-undo') {
            this.props.onUndo();

            return 'handled';
        }

        if (command === 'toggle-link') {
            newState = getSelectedEntityType(this.state.editorState) === 'LINK'
                ? this.removeLink()
                : this.addLink();
        } else {
            newState = RichUtils.handleKeyCommand(editorState, command);
        }

        if (newState) {
            this.onChange(newState);
            return 'handled';
        }

        return 'not-handled';
    }

    /**
     * @ngdoc method
     * @name TableCell#addLink
     * @description Adds a new link on top of the current selection. If the selection
     * is collapsed, no action is taken.
     */
    addLink() {
        const {editorState} = this.state;

        // can't add a link if selection is collapsed
        if (editorState.getSelection().isCollapsed()) {
            return editorState;
        }

        // eslint-disable-next-line no-alert
        const url = prompt('Enter a URL');
        const contentState = editorState.getCurrentContent().createEntity('LINK', 'MUTABLE', {url});

        return RichUtils.toggleLink(
            editorState,
            editorState.getSelection(),
            contentState.getLastCreatedEntityKey()
        );
    }

    /**
     * @ngdoc method
     * @name TableCell#removeLink
     * @description Removes the link behind the selection focus.
     */
    removeLink() {
        const {editorState} = this.state;
        let stateAfterChange = editorState;

        getSelectedEntityRange(editorState,
            (start, end) => {
                const selection = editorState.getSelection();
                const entitySelection = selection.merge({
                    anchorOffset: start,
                    focusOffset: end,
                });

                stateAfterChange = RichUtils.toggleLink(editorState, entitySelection, null);
            }
        );

        return stateAfterChange;
    }

    /**
     * @ngdoc method
     * @name TableCell#onChange
     * @param {Object} editorState the new editor state.
     * @description Triggered on changes to the cell's state.
     */
    onChange(editorState) {
        this.setState(
            {editorState},
            () => this.props.onChange(editorState)
        );
    }

    render() {
        const {editorState} = this.state;
        const {onFocus, readOnly} = this.props;

        return (
            <td onClick={(event) => event.stopPropagation()}>
                <Editor
                    onFocus={onFocus}
                    editorState={editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    readOnly={readOnly}
                    onChange={this.onChange}
                    keyBindingFn={this.keyBindingFn} />
            </td>
        );
    }
}

TableCell.propTypes = {
    editorState: PropTypes.object.isRequired,
    readOnly: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
};
