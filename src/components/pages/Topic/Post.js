import React, {Component, PropTypes} from 'react';
import {View, Text, Image, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import {Actions} from 'react-native-router-flux';

import HTMLView from 'react-native-htmlview';

import StringUtilities from '../../../utilities/string';
import LinkHandler from '../../../utilities/link_handler';
import ResizableImage from '../../common/ResizableImage';

const {width: screenWidth} = Dimensions.get('window');
const imageMaxWidth = screenWidth - 16 * 2;

class Post extends Component {

  render() {
    const { /* id, */ content, authorAvatarURI, authorName, time, floor /*, appreciationCount*/ } = this.props;

    return (
      <View style={{ overflow: 'hidden' }}>
        <View style={styles.metaContainer}>
          <TouchableWithoutFeedback onPress={() => Actions.user({username: authorName})}>
            <Image style={styles.avatarImage} source={{ uri: `https:${authorAvatarURI}` }} />
          </TouchableWithoutFeedback>
          <View style={styles.innerMetaContainer}>
            <TouchableWithoutFeedback onPress={() => Actions.user({username: authorName})}>
              <View><Text style={styles.authorNameText}>{authorName}</Text></View>
            </TouchableWithoutFeedback>
            <Text style={styles.otherInfoText}>{this.buildOtherInfoText(time, floor)}</Text>
          </View>
        </View>
        <View style={styles.htmlViewWrapper}>
          <HTMLView value={content}
            stylesheet={htmlViewStyles}
            renderNode={this.renderNode}
            onLinkPress={this._onLinkPress.bind(this)} />
        </View>
        <View style={styles.separator} />
      </View>
    );
  }

  renderNode(node) {
    if (node.type === 'tag') {
      if (node.name === 'img') {
        var img_w = +node.attribs['width'] || +node.attribs['data-width'] || 0;
        var img_h = +node.attribs['height'] || +node.attribs['data-height'] || 0;

        var imgStyle = {
          width: img_w,
          height: img_h,
        };

        var src = node.attribs.src || '';
        src = src.startsWith('//') ? `https:${src}` : src;

        var source = {
          uri: src,
          width: img_w,
          height: img_h,
        };
        console.log({ imageMaxWidth });
        return (
          <ResizableImage source={source} style={imgStyle} maxWidth={imageMaxWidth} />
        );
      }
    }
    return undefined;
  }

  _onLinkPress(link) {
    LinkHandler.handleURL(link);
  }

  buildOtherInfoText(time, floor) {
    const floorText = floor === 0 ? '楼主' : `# ${floor}`;
    return `|   ${time}   |   ${floorText}`;
  }

}

const styles = StyleSheet.create({
  metaContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
  },
  avatarImage: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
  },
  innerMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorNameText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#6D6D72',
  },
  otherInfoText: {
    marginLeft: 10,
    paddingTop: 2,
    fontSize: 12,
    color: '#AAB8C1',
  },
  htmlViewWrapper: {
    margin: 10,
    marginLeft: 16,
    marginRight: 16,
  },
  separator: {
    marginLeft: 16,
    height: 0.5,
    backgroundColor: '#D8E0E4',
    marginBottom: 10,
  },
});

const htmlViewStyles = StyleSheet.create({

});

export default Post;
