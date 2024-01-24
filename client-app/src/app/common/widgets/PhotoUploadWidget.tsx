import { Button, ButtonGroup, Grid, GridColumn, Header } from "semantic-ui-react";
import UploadImageDropZone from "./UploadImageDropZone";
import { useEffect, useState } from "react";
import ImageCropper from "./ImageCropper";
import LoadingComponent from "../../layout/LoadingComponent";

interface Props{
  loading: boolean,
  uploadPhoto: (file: Blob) => void;
}
const PhotoUploadWidget = ({uploadPhoto, loading}: Props) => {

  const [files, setFiles] = useState<any>([]);
  const [cropper, setCropper] = useState<Cropper>();

  function onCrop() {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
    }
  }

  useEffect(() => {
    return () => {
      files.forEach((file: any) => 
        URL.revokeObjectURL(file.preview)
      );
    }
  }, [files])

  if(loading) return <LoadingComponent content='Uploading photo'></LoadingComponent>

  return (
    <Grid>
      <GridColumn width={4}>
        <Header sub color="teal" content="Step 1 - Add Image" />
        <UploadImageDropZone setFiles={setFiles}></UploadImageDropZone>
      </GridColumn>
      <GridColumn width={1} />
      <GridColumn width={4}>
        <Header sub color="teal" content="Step 2 - Rezise Image" />
        {files && files.length > 0 && (
          <ImageCropper setCropper={setCropper} imagePreview={files[0].preview} />)}
      </GridColumn>
      <GridColumn width={1} />
      <GridColumn width={4}>
        <Header sub color="teal" content="Step 3 -Preview & Upload" />
        {files && files.length > 0 &&
          <>
            <div className="img-preview" style={{ minHeight: 200, overflow: 'hidden' }}></div>
            <ButtonGroup widths={2}>
              <Button onClick={onCrop} positive icon='check'></Button>
              <Button onClick={() => setFiles([])} icon='close'></Button>
            </ButtonGroup>
          </>}
      </GridColumn>
    </Grid>
  )
};

export default PhotoUploadWidget;
