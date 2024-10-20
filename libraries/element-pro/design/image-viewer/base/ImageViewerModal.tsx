import { computed, defineComponent, PropType } from '@vue/composition-api';
import ElDialog from '../../dialog';
import ElImageItem from './ImageItem';
import ElImageViewerUtils from './ImageViewerUtils';
import { usePrefixClass } from '../../hooks/useConfig';
import { useElNodeJSX } from '../../hooks/tnode';
import { ImageInfo, ElImageViewerProps } from '../type';
import props from '../props';

const defaultProps = {
  zIndex: Number,
  visible: Boolean,
  index: Number,
  images: props.images,
  scale: Number,
  rotate: Number,
  mirror: Number,
  currentImage: {
    type: Object as PropType<ImageInfo>,
    default() {
      return {};
    },
  },
  rotateHandler: Function as PropType<() => void>,
  zoomInHandler: Function as PropType<() => void>,
  zoomOutHandler: Function as PropType<() => void>,
  mirrorHandler: Function as PropType<() => void>,
  resetHandler: Function as PropType<() => void>,
  closeHandler: props.onClose,
  draggable: {
    type: Boolean,
    default: true,
  },
  viewerScale: {
    type: Object as PropType<ElImageViewerProps['viewerScale']>,
    default() {
      return {};
    },
  },
  showOverlay: Boolean,
  closeBtn: props.closeBtn,
};

export default defineComponent({
  name: 'ElImageViewerModal',
  props: { ...defaultProps },
  setup(props) {
    const classPrefix = usePrefixClass();
    const renderJSX = useElNodeJSX();
    const style = computed(() => ({
      minWidth: props.viewerScale.minWidth,
      minHeight: props.viewerScale.minHeight,
    }));

    return {
      classPrefix,
      renderJSX,
      style,
    };
  },
  render() {
    return (
      <ElDialog
        destroyOnClose
        onClose={this.closeHandler}
        visible={this.visible}
        placement="center"
        mode="modeless"
        width={1000}
        cancelBtn={null}
        confirmBtn={null}
        draggable={this.draggable}
        zIndex={this.zIndex}
        showOverlay={this.showOverlay}
        class={`${this.classPrefix}-image-viewer__dialog`}
        header={this.title}
        footer={() => (
          <div class={`${this.classPrefix}-image-viewer-mini__footer`}>
            <ElImageViewerUtils
              zoomInHandler={this.zoomInHandler}
              zoomOutHandler={this.zoomOutHandler}
              scale={this.scale}
              currentImage={this.currentImage}
              rotateHandler={this.rotateHandler}
              mirrorHandler={this.mirrorHandler}
              resetHandler={this.resetHandler}
            />
          </div>
        )}
      >
        <div class={`${this.classPrefix}-image-viewer-mini__content`} style={this.style}>
          <ElImageItem
            rotate={this.rotate}
            scale={this.scale}
            mirror={this.mirror}
            src={this.currentImage.mainImage}
            placementSrc={this.currentImage.thumbnail}
          />
        </div>
      </ElDialog>
    );
  },
});
