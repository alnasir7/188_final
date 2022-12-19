// /* eslint-disable react/prop-types */
// /* eslint-disable react/jsx-props-no-spreading */

import styled from 'styled-components';
// import Select, { components } from 'react-select';
// import Tags from './tags';
// import { miscGrey, orange } from '../../colors';

// const styles = {
//   control: ({ background, ...base }) => ({
//     ...base,
//     boxShadow: 'none',
//     color: 'black',
//     background: miscGrey,
//     margin: 'auto',
//     borderRadius: '5px',
//   }),
//   option: ({ background, ...base }) => ({
//     ...base,
//   }),

//   singleValue: (base) => ({
//     ...base,
//     color: 'red',
//   }),
// };

// const ValueContainer = ({ children, ...props }) => {
//   const { getValue, hasValue } = props;
//   const nbValues = getValue().length;
//   if (!hasValue) {
//     return (
//       <components.ValueContainer {...props}>
//         {children}
//       </components.ValueContainer>
//     );
//   }
//   return (
//     <components.ValueContainer {...props}>
//       {nbValues === 1 ? 'One Item Selected' : `${nbValues} items selected`}
//     </components.ValueContainer>
//   );
// };

// const customeComponents = {
//   IndicatorSeparator: () => null,
//   ValueContainer,
// };

// const TagAddButton = styled.span`
//   margin: 0 20px 5px 0px;
//   font-weight: 300;
//   &.tag {
//     background: ${miscGrey};
//     color: blue;
//     white-space: normal;
//     display: inline-block;
//     height: auto;
//     padding-top: 0.1em;
//     padding-bottom: 0.1em;
//     border-radius: 5px;
//   }
// `;

// const options = [
//   { value: 'Technology', label: 'Technology' },
//   { value: 'Music', label: 'Music' },
//   { value: 'Sports', label: 'Sports' },
//   { value: 'History', label: 'History' },
//   { value: 'Gaming', label: 'Gaming' },
//   { value: 'Physics', label: 'Physics' },
//   { value: 'Mental Health', label: 'Mental Health' },
//   { value: 'Work', label: 'Work' },
//   {
//     value: 'Travel',
//     label: 'Travel',
//   },
// ];

// const AddTagsContainer = styled.div`
// display:flex;
// flex-direction:row;
// aligh-items:start;
// `;

// const AddTags = () => {
//   const [tags, setTags] = useState([]);

//   const removeTag = (name) => {
//     const tempTags = [...tags];
//     const index = tempTags.indexOf(name);
//     if (index > -1) {
//       tempTags.splice(index, 1);
//     }
//     setTags(tempTags);
//   };

//   const handleTagChange = (e) => {
//     setTags(
//       e.map((item) => item.value),
//     );
//   };

//   useEffect(() => {
//     console.log('fetched data');
//     setTags([]);
//   }, []);

//   return (
//     <AddTagsContainer>
//       <TagAddButton>
//         <div className="flex-item">
//           <Select
//             isMulti
//             hideSelectedOptions={false}
//             components={customeComponents}
//             styles={styles}
//             onChange={handleTagChange}
//             name="colors"
//             options={options}
//             placeholder="Add Tags"
//             className="basic-multi-select"
//             classNamePrefix="select"
//             theme={(theme) => ({
//               ...theme,
//               colors: {
//                 ...theme.colors,
//                 primary: orange,
//               },
//             })}
//           />
//         </div>
//       </TagAddButton>
//       {
//         tags && (
//         <Tags removable removeTag={removeTag} colors="#ed8915" tags={tags} />
//         )
//         }

//     </AddTagsContainer>
//   );
// };

// export default AddTags;

const TagsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  min-height: 48px;
  max-height: 130px;
  overflow-y: scroll;
  width: 400px;
  padding: 0 8px;
  background: white;
  border: 1px solid rgb(214, 216, 218);
  border-radius: 6px;

  &:focus-within {
    border: 1px solid #0052cc;
  }

  input {
    flex: 1;
    border: none;
    height: 46px;
    font-size: 14px;
    padding: 4px 0 0 0;

    &:focus {
      outline: transparent;
    }
  }
`;

const TagsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 8px 0 0 0;
`;

const Tag = styled.li`
  width: auto;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding: 0 8px;
  font-size: 14px;
  list-style: none;
  border-radius: 6px;
  margin: 0 8px 8px 0;
  background: #ed8915;

  .tag-title {
    margin-top: 3px;
  }

  .tag-close-icon {
    display: block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    font-size: 14px;
    margin-left: 8px;
    color: black;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
  }
`;

// Component copied and modified from https://dev.to/prvnbist/create-a-tags-input-component-in-reactjs-ki

//tags and setTags required, setTagError is not
const AddTags = (props) => {
  let {
    tags,
    setTags,
    setTagError
  } = props;

  const removeTags = indexToRemove => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)]);
  };
  const addTags = event => {
    event.preventDefault();
    const tag = event.target.value;
    if (setTagError) {
      if (tag !== '') {
        if (!tag.match(/^[a-zA-Z0-9]{1,24}$/g)) {
          setTagError(true);
          event.stopPropagation();
        } else {
          setTags([...tags, event.target.value]);
          setTagError(false);
          event.target.value = '';
        }
      }
    } else {
      if (tag !== '') {
        setTags([...tags, event.target.value]);
        event.target.value = '';
      }
    }
  };

  return (
    <TagsWrapper>
      <TagsList>
        {tags.map((tag, index) => (
          <Tag key={index}>
            <span className="tag-title">{tag}</span>
            <span className="tag-close-icon"
                  onClick={() => removeTags(index)}
            >
							x
						</span>
          </Tag>
        ))}
      </TagsList>
      <input
        type="text"
        onKeyUp={event => event.key === 'Enter' ? addTags(event) : null}
        placeholder="Press enter to add tags"
      />
    </TagsWrapper>
  );
};

export default AddTags;
