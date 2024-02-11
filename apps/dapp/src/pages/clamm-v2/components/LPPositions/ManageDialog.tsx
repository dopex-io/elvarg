import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from '@radix-ui/react-dialog';

const ManageDialog = () => {
  return (
    <Root>
      <Trigger className="bg-primary text-[13px] px-[12px] py-[4px] rounded-lg">
        Manage
      </Trigger>
      <Portal>
        <Overlay className="fixed inset-0 backdrop-blur-sm" />
        <Content>
          this is the contexnt
          <Title> This is the title </Title>
          <Description> this is the descriptiuon </Description>
        </Content>
      </Portal>
    </Root>
  );
};

export default ManageDialog;
