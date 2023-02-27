import { SeriesPost } from '~/lib/types';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import reorder from '~/lib/reorder';
import { useEffect, useState } from 'react';
import SeriesPostItem from './SeriesPostItem';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

interface Props {
  seriesPosts: SeriesPost[];
  onChangeSeriesOrder: (order: string[]) => void;
}

const SeriesEditor = ({ seriesPosts, onChangeSeriesOrder }: Props) => {
  const [tempSeriesPosts, setTempSeriesPosts] = useState(seriesPosts);

  useEffect(() => {
    console.log('tempSeriesPosts', tempSeriesPosts);

    onChangeSeriesOrder(tempSeriesPosts.map((item) => item.id));
  }, [onChangeSeriesOrder, tempSeriesPosts]);

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;
    if (destination.index === source.index) return;

    setTempSeriesPosts((prev) => {
      return reorder(prev, source.index, destination.index);
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="drop">
        {(provided, snapshot) => (
          <DroppableBlock
            {...provided.droppableProps}
            ref={provided.innerRef}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {tempSeriesPosts?.map((seriesPost, index) => {
              return (
                <Draggable
                  key={seriesPost.id}
                  draggableId={seriesPost.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <DraggableBlock
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      isDragging={snapshot.isDragging}
                    >
                      <SeriesPostItem seriesPost={seriesPost} index={index} />
                    </DraggableBlock>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </DroppableBlock>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const DroppableBlock = styled.div<{ isDraggingOver: boolean }>`
  background: ${(props) => (props.isDraggingOver ? 'gray' : 'red')};
  border-radius: 4px;
  padding: 1.5rem;
  padding-bottom: 0.5rem;
`;

const DraggableBlock = styled.div<{ isDragging: boolean }>`
  user-select: none;
  background-color: #ccc;
  padding: 1.5rem;
  border-radius: 10px;
  ${(props) =>
    props.isDragging
      ? css`
          opacity: 0.6;
        `
      : css`
          opacity: 1;
        `}
  margin-bottom: 1rem;
`;

export default SeriesEditor;
